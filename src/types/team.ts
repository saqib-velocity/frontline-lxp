export type MemberStatus = 'overdue' | 'due-soon' | 'compliant';

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string;
  /** Initials used when no avatar photo */
  initials: string;
  avatarColor: string;
  progress: number;       // 0-100
  dueDate: string;        // e.g. '01 Jan'
  status: MemberStatus;
}

export type MyTeamTab = 'compliance' | 'requests' | 'report';
export type ComplianceTab = 'needs-attention' | 'compliant';
