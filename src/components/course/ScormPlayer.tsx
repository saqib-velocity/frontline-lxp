/**
 * ScormPlayer
 *
 * Renders a SCORM package inside a WebView with a full SCORM 1.2 + 2004 API
 * shim injected before any page script runs.
 *
 * When a real SCORM zip is available:
 *   1. Unzip it with expo-file-system to `FileSystem.cacheDirectory + 'scorm/'`
 *   2. Pass `uri="file://.../scorm/index.html"` (or the launch file from
 *      imsmanifest.xml).
 *
 * The component bridges SCORM data back to RN via postMessage so progress
 * and completion status can be persisted.
 */

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

// ─── SCORM 1.2 + 2004 shim injected into every page ─────────────────────────

const SCORM_SHIM = `
(function () {
  if (window.__scormShimInstalled) return;
  window.__scormShimInstalled = true;

  var _store = {};

  function _get(key)  { return _store[key] !== undefined ? String(_store[key]) : ''; }
  function _set(key, val) {
    _store[key] = val;
    try {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'scorm_set', key: key, value: String(val) })
      );
    } catch(e){}
    return 'true';
  }
  function _finish(type) {
    try {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: type })
      );
    } catch(e){}
    return 'true';
  }

  // ── SCORM 1.2 ──────────────────────────────────────────────────────────────
  window.API = {
    LMSInitialize  : function() { return 'true'; },
    LMSFinish      : function() { return _finish('scorm_finish'); },
    LMSGetValue    : function(k) { return _get(k); },
    LMSSetValue    : function(k,v) { return _set(k,v); },
    LMSCommit      : function() { return 'true'; },
    LMSGetLastError: function() { return '0'; },
    LMSGetErrorString : function() { return ''; },
    LMSGetDiagnostic  : function() { return ''; },
  };

  // ── SCORM 2004 ─────────────────────────────────────────────────────────────
  window.API_1484_11 = {
    Initialize : function() { return 'true'; },
    Terminate  : function() { return _finish('scorm_finish'); },
    GetValue   : function(k) { return _get(k); },
    SetValue   : function(k,v) { return _set(k,v); },
    Commit     : function() { return 'true'; },
    GetLastError      : function() { return '0'; },
    GetErrorString    : function() { return ''; },
    GetDiagnostic     : function() { return ''; },
  };
})();
true; // required by injectedJavaScriptBeforeContentLoaded
`;

// ─── Placeholder HTML used when no real SCORM URI is provided ────────────────

const PLACEHOLDER_HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, sans-serif;
    background: #1a1a1a;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 20px;
    padding: 24px;
    text-align: center;
  }
  .logo { font-size: 48px; }
  h2 { font-size: 20px; font-weight: 700; }
  p  { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6; }
  .btn {
    margin-top: 8px;
    background: #C24806;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 14px 32px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
  }
</style>
</head>
<body>
  <div class="logo">🎓</div>
  <h2>SCORM Content Ready</h2>
  <p>Upload your SCORM zip file and it will play here with full LMS tracking.</p>
  <button class="btn" onclick="complete()">Mark Complete (Demo)</button>
  <script>
    function complete() {
      if (window.API) {
        API.LMSInitialize('');
        API.LMSSetValue('cmi.core.lesson_status', 'passed');
        API.LMSSetValue('cmi.core.score.raw', '100');
        API.LMSFinish('');
      }
    }
  </script>
</body>
</html>`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScormPlayerRef {
  /** Inject arbitrary JS into the running SCORM page */
  injectJS: (js: string) => void;
}

interface Props {
  /** file:// URI pointing to the SCORM launch HTML, or undefined to show placeholder */
  uri?: string;
  /** Called whenever the SCORM content sets a data value */
  onScormValue?: (key: string, value: string) => void;
  /** Called when the SCORM content signals completion (LMSFinish / Terminate) */
  onComplete?: () => void;
  style?: object;
}

// ─── Component ───────────────────────────────────────────────────────────────

const ScormPlayer = forwardRef<ScormPlayerRef, Props>(function ScormPlayer(
  { uri, onScormValue, onComplete, style },
  ref,
) {
  const webRef = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    injectJS: (js) => webRef.current?.injectJavaScript(js),
  }));

  function handleMessage(e: WebViewMessageEvent) {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === 'scorm_set') {
        onScormValue?.(msg.key, msg.value);
      } else if (msg.type === 'scorm_finish') {
        onComplete?.();
      }
    } catch (_) { /* non-SCORM postMessages are ignored */ }
  }

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webRef}
        // Real SCORM: load from unzipped file:// URI
        // Placeholder: inline HTML
        {...(uri
          ? {
              source: { uri },
              allowFileAccess: true,
              allowUniversalAccessFromFileURLs: true,
              originWhitelist: ['*', 'file://*'],
            }
          : { source: { html: PLACEHOLDER_HTML } }
        )}
        injectedJavaScriptBeforeContentLoaded={SCORM_SHIM}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        onMessage={handleMessage}
        style={styles.webview}
        // Hide the scrollbar inside the WebView — content scrolls via outer ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
});

export default ScormPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
