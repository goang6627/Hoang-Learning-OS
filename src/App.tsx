import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Map,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings,
  Target,
  Trash2,
  Upload,
} from 'lucide-react'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import './index.css'

type CompletionStatus = 'not_started' | 'planned' | 'studying' | 'completed' | 'retaking' | 'improving'
type RiskLevel = 'none' | 'low' | 'watch' | 'high' | 'critical'
type ImportanceLevel = 'low' | 'medium' | 'high' | 'critical'
type RecoveryAction = 'none' | 'review_foundation' | 'improve_if_allowed' | 'retake_if_allowed' | 'protect_next_subjects'
type SubjectTag =
  | 'GPA'
  | 'CP'
  | 'CS'
  | 'SE'
  | 'AI'
  | 'FRONTEND'
  | 'BACKEND'
  | 'DATABASE'
  | 'SYSTEMS'
  | 'NETWORKING'
  | 'MATH'
  | 'CAREER'
  | 'RESEARCH'
  | 'ENGLISH'

type SubjectGrade = {
  score10?: number
  letter?: 'A' | 'B' | 'C' | 'D' | 'F' | string
  point4?: number
}

type CurriculumSubject = {
  code: string
  name: string
  credits: number
  expectedSemester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  groupId: string
  required: boolean
  completionStatus: CompletionStatus
  riskLevel: RiskLevel
  importance: ImportanceLevel
  recoveryAction: RecoveryAction
  tags: SubjectTag[]
  grade?: SubjectGrade
  notes?: string
  prerequisites?: string[]
}

type RequirementGroup = {
  id: string
  name: string
  minCreditsRequired: number
  mandatoryCreditsRequired: number
  groupType: 'general' | 'foundation' | 'major' | 'specialization' | 'internship' | 'graduation'
  isSpecializationOption?: boolean
}

type AcademicProfile = {
  studentName: string
  university: string
  major: string
  cohort: string
  minimumRequiredCredits: number
  completedCredits: number
  cumulativeGPA10?: number
  cumulativeGPA4: number
  targetShortTermGPA4: number
  targetScholarshipGPA4: number
  targetExcellentGPA4: number
  selectedSpecializationGroupIds: string[]
}

type SemesterPlan = {
  semester: number
  academicYear: string
  targetSemesterGPA4: number
  maxCreditsRecommended: number
  subjects: string[]
  subjectPlans: SemesterSubjectPlan[]
  focus: Array<'GPA' | 'CP' | 'CS' | 'SE' | 'RECOVERY'>
  weeklyRules: string[]
}

type SemesterSubjectPlan = {
  subjectCode: string
  targetGrade: 'A' | 'B+' | 'B' | 'C+' | 'C'
  status: 'not_started' | 'studying' | 'assignment' | 'exam_review' | 'safe'
  weeklyHours: number
}

type DailyTask = {
  id: string
  title: string
  lane: 'GPA' | 'CP' | 'CS_SE'
  subjectCode?: string
  weeklyBlockId?: string
  source?: 'manual' | 'exam' | 'cp' | 'project' | 'roadmap'
  createdAt?: string
  dueDate?: string
  done: boolean
}

type StudySession = {
  id: string
  date: string
  lane: DailyTask['lane']
  minutes: number
  subjectCode?: string
  note: string
}

type FixedEvent = {
  id: string
  title: string
  type: 'class' | 'work' | 'exam' | 'deadline' | 'personal'
  date?: string
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7
  startTime: string
  endTime: string
  subjectCode?: string
  note?: string
}

type WeeklyStudyBlock = {
  id: string
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7
  startTime: string
  endTime: string
  subjectCode: string
  lane: DailyTask['lane']
  reason: string
  source: 'auto' | 'manual'
  done: boolean
  taskId?: string
}

type PomodoroSession = {
  id: string
  startedAt: string
  completedAt: string
  minutes: number
  subjectCode?: string
  taskId?: string
  studyBlockId?: string
  label: string
}

type FocusTarget = {
  label: string
  lane: DailyTask['lane']
  subjectCode?: string
  taskId?: string
  studyBlockId?: string
}

type CpProblem = {
  id: string
  title: string
  platform: 'Codeforces' | 'VNOJ' | 'LeetCode' | 'Kattis' | 'Other'
  topic: 'implementation' | 'math' | 'greedy' | 'dp' | 'graph' | 'data_structure' | 'string'
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'todo' | 'solved' | 'upsolve'
  solvedAt?: string
  note?: string
}

type StudyProject = {
  id: string
  name: string
  track: 'frontend' | 'backend' | 'database' | 'fullstack' | 'portfolio'
  status: 'idea' | 'planning' | 'building' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  subjectCode?: string
  goal: string
  nextAction: string
  milestones: Array<{
    id: string
    title: string
    done: boolean
  }>
}

type StudyResource = {
  id: string
  title: string
  url: string
  type: 'doc' | 'video' | 'course' | 'practice' | 'tool' | 'note'
  area: 'GPA' | 'CP' | 'CS' | 'SE' | 'MATH' | 'CAREER'
  status: 'saved' | 'using' | 'finished'
  subjectCode?: string
  note?: string
}

type WeeklyReview = {
  id: string
  weekStart: string
  riskSubject: string
  assignmentStatus: string
  cramRisk: string
  cpUpsolve: string
  nextWeekFocus: string
  savedAt: string
}

type DailyReview = {
  id: string
  date: string
  doneTasks: number
  totalTasks: number
  focusMinutes: number
  subjects: string[]
  cpTasks: string[]
  projectTasks: string[]
  carryOverTasks: string[]
  tomorrowSuggestions: string[]
  savedAt: string
}

type AppSettings = {
  showPlaceholderPages: boolean
  lastBackupAt?: string
  lastBackupFileName?: string
  lastImportAt?: string
}

type AppData = {
  academicProfile: AcademicProfile
  curriculumSubjects: CurriculumSubject[]
  requirementGroups: RequirementGroup[]
  semesterPlans: SemesterPlan[]
  dailyTasks: DailyTask[]
  studySessions: StudySession[]
  weeklyFixedEvents: FixedEvent[]
  weeklyStudyBlocks: WeeklyStudyBlock[]
  pomodoroSessions: PomodoroSession[]
  cpProblems: CpProblem[]
  projects: StudyProject[]
  resources: StudyResource[]
  weeklyReviews: WeeklyReview[]
  dailyReviews: DailyReview[]
  settings: AppSettings
}

type BackupPayload = {
  schema: 'hoang-learning-os-backup'
  appName: 'Hoang Learning OS'
  dataVersion: string
  exportedAt: string
  data: AppData
}

type BackupSummary = {
  dailyTasks: number
  dailyReviews: number
  cpProblems: number
  projects: number
  subjects: number
  fixedEvents: number
}

type PendingImport = {
  fileName: string
  source: 'backup' | 'legacy'
  dataVersion?: string
  exportedAt?: string
  data: AppData
  summary: BackupSummary
}

type Page = 'dashboard' | 'learningPath' | 'exams' | 'study' | 'gpa' | 'roadmap' | 'recovery' | 'semester' | 'weekly' | 'settings' | 'daily' | 'weeklyPlan' | 'cp' | 'project' | 'resources'

type ToastMessage = {
  id: number
  text: string
  tone: 'success' | 'info' | 'warning'
}

type GlobalSearchResult = {
  id: string
  label: string
  meta: string
  page: Page
  subjectCode?: string
}

const today = getLocalDateKey(new Date())
const DATA_VERSION = 'real-2025-2026.2-daily-review-v5'

const STORAGE_KEYS = {
  dataVersion: 'hoang_learning_os_data_version',
  academicProfile: 'hoang_learning_os_academic_profile',
  curriculumSubjects: 'hoang_learning_os_curriculum_subjects',
  requirementGroups: 'hoang_learning_os_requirement_groups',
  semesterPlans: 'hoang_learning_os_semester_plans',
  dailyTasks: 'hoang_learning_os_daily_tasks',
  studySessions: 'hoang_learning_os_study_sessions',
  weeklyFixedEvents: 'hoang_learning_os_weekly_fixed_events',
  weeklyStudyBlocks: 'hoang_learning_os_weekly_study_blocks',
  pomodoroSessions: 'hoang_learning_os_pomodoro_sessions',
  cpProblems: 'hoang_learning_os_cp_problems',
  projects: 'hoang_learning_os_projects',
  resources: 'hoang_learning_os_resources',
  weeklyReviews: 'hoang_learning_os_weekly_reviews',
  dailyReviews: 'hoang_learning_os_daily_reviews',
  settings: 'hoang_learning_os_settings',
} as const

const subjectTags: SubjectTag[] = ['GPA', 'CP', 'CS', 'SE', 'AI', 'FRONTEND', 'BACKEND', 'DATABASE', 'SYSTEMS', 'NETWORKING', 'MATH', 'CAREER', 'RESEARCH', 'ENGLISH']
const completionStatuses: Array<CompletionStatus | 'all'> = ['all', 'not_started', 'planned', 'studying', 'completed', 'retaking', 'improving']
const riskLevels: Array<RiskLevel | 'all'> = ['all', 'none', 'low', 'watch', 'high', 'critical']
const importanceLevels: Array<ImportanceLevel | 'all'> = ['all', 'low', 'medium', 'high', 'critical']
const cpPlatforms: CpProblem['platform'][] = ['Codeforces', 'VNOJ', 'LeetCode', 'Kattis', 'Other']
const cpTopics: CpProblem['topic'][] = ['implementation', 'math', 'greedy', 'dp', 'graph', 'data_structure', 'string']
const cpDifficulties: CpProblem['difficulty'][] = ['easy', 'medium', 'hard']
const projectTracks: StudyProject['track'][] = ['frontend', 'backend', 'database', 'fullstack', 'portfolio']
const projectStatuses: StudyProject['status'][] = ['idea', 'planning', 'building', 'review', 'done']
const projectPriorities: StudyProject['priority'][] = ['low', 'medium', 'high', 'critical']
const resourceTypes: StudyResource['type'][] = ['doc', 'video', 'course', 'practice', 'tool', 'note']
const resourceAreas: StudyResource['area'][] = ['GPA', 'CP', 'CS', 'SE', 'MATH', 'CAREER']
const resourceStatuses: StudyResource['status'][] = ['saved', 'using', 'finished']
const semesterSubjectStatuses: SemesterSubjectPlan['status'][] = ['not_started', 'studying', 'assignment', 'exam_review', 'safe']
const semesterTargetGrades: SemesterSubjectPlan['targetGrade'][] = ['A', 'B+', 'B', 'C+', 'C']
const fixedEventTypes: FixedEvent['type'][] = ['class', 'work', 'exam', 'deadline', 'personal']
const weekDays: Array<{ value: FixedEvent['dayOfWeek']; label: string }> = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
]

const academicProfileSeed: AcademicProfile = {
  studentName: 'Ngô Huy Hoàng',
  university: 'HUSC - Trường Đại học Khoa học, Đại học Huế',
  major: 'Công nghệ thông tin',
  cohort: 'K49 (2025-2029)',
  minimumRequiredCredits: 122,
  completedCredits: 14,
  cumulativeGPA10: 6.99,
  cumulativeGPA4: 2.5,
  targetShortTermGPA4: 3.0,
  targetScholarshipGPA4: 3.2,
  targetExcellentGPA4: 3.6,
  selectedSpecializationGroupIds: ['cs_specialization'],
}

const requirementGroupsSeed: RequirementGroup[] = [
  { id: 'general_education', name: 'Kiến thức giáo dục đại cương', minCreditsRequired: 30, mandatoryCreditsRequired: 30, groupType: 'general' },
  { id: 'foundation', name: 'Kiến thức cơ sở ngành', minCreditsRequired: 26, mandatoryCreditsRequired: 23, groupType: 'foundation' },
  { id: 'major', name: 'Kiến thức ngành', minCreditsRequired: 29, mandatoryCreditsRequired: 26, groupType: 'major' },
  { id: 'cs_specialization', name: 'Kiến thức chuyên ngành Khoa học máy tính', minCreditsRequired: 21, mandatoryCreditsRequired: 9, groupType: 'specialization', isSpecializationOption: true },
  { id: 'internship', name: 'Thực tập, kiến tập', minCreditsRequired: 6, mandatoryCreditsRequired: 6, groupType: 'internship' },
  { id: 'graduation', name: 'Khóa luận tốt nghiệp hoặc học phần thay thế KLTN', minCreditsRequired: 10, mandatoryCreditsRequired: 0, groupType: 'graduation' },
]

type CurriculumSeedRow = readonly [string, string, number, CurriculumSubject['expectedSemester'], string, boolean]

const curriculumSeedRows: CurriculumSeedRow[] = [
  ['KNM1013', 'Kỹ năng mềm', 3, 1, 'general_education', true],
  ['LLCTTH3', 'Triết học Mác - Lênin', 3, 1, 'general_education', true],
  ['TIN1093', 'Nhập môn lập trình', 3, 1, 'general_education', true],
  ['TOA1023', 'Đại số tuyến tính', 3, 2, 'general_education', true],
  ['LLCTKT2', 'Kinh tế chính trị Mác - Lênin', 2, 2, 'general_education', true],
  ['TIN1103', 'Lập trình Python', 3, 3, 'general_education', true],
  ['TOA1053', 'Giải tích', 3, 3, 'general_education', true],
  ['LLCTXH2', 'Chủ nghĩa xã hội khoa học', 2, 5, 'general_education', true],
  ['LUA1012', 'Pháp luật Việt Nam đại cương', 2, 6, 'general_education', true],
  ['LLCTLS2', 'Lịch sử Đảng Cộng sản Việt Nam', 2, 6, 'general_education', true],
  ['LLCTTT2', 'Tư tưởng Hồ Chí Minh', 2, 7, 'general_education', true],
  ['MTR1022', 'Giáo dục môi trường đại cương', 2, 7, 'general_education', true],
  ['TIN3173', 'Lập trình Front-End', 3, 1, 'foundation', true],
  ['TOA1012', 'Cơ sở toán', 2, 1, 'foundation', true],
  ['TIN3083', 'Lập trình nâng cao', 3, 2, 'foundation', true],
  ['TIN1083', 'Kỹ thuật lập trình', 3, 2, 'foundation', true],
  ['TIN3023', 'Toán học rời rạc', 3, 3, 'foundation', true],
  ['TOA2023', 'Xác suất thống kê', 3, 4, 'foundation', true],
  ['TOA2033', 'Phương pháp tính', 3, 4, 'foundation', false],
  ['TOA4213', 'Lý thuyết tối ưu', 3, 4, 'foundation', false],
  ['TIN4083', 'Ngôn ngữ hình thức và Ôtômat', 3, 4, 'foundation', false],
  ['TIN2013', 'Kiến trúc máy tính', 3, 4, 'foundation', true],
  ['TIN1033', 'Java cơ bản', 3, 4, 'foundation', true],
  ['TIN3183', 'Cơ sở dữ liệu', 3, 2, 'major', true],
  ['TIN3044', 'Hệ quản trị cơ sở dữ liệu', 4, 3, 'major', true],
  ['TIN3073', 'Lập trình hướng đối tượng', 3, 3, 'major', true],
  ['TIN3084', 'Cấu trúc dữ liệu và thuật toán', 4, 4, 'major', true],
  ['TIN3123', 'Mạng máy tính', 3, 5, 'major', true],
  ['TIN3133', 'Đồ họa máy tính', 3, 5, 'major', false],
  ['TIN3024', 'Phân tích và thiết kế các hệ thống thông tin', 4, 5, 'major', true],
  ['TIN3042', 'Nguyên lý hệ điều hành', 2, 5, 'major', true],
  ['TIN4303', 'Quản trị mạng', 3, 5, 'major', false],
  ['TIN4253', 'Mẫu thiết kế', 3, 5, 'major', false],
  ['TIN4663', 'Trí tuệ nhân tạo', 3, 5, 'major', true],
  ['TIN4623', 'Học máy', 3, 6, 'cs_specialization', true],
  ['TIN4243', 'Lý thuyết nhận dạng', 3, 6, 'cs_specialization', false],
  ['TIN4213', 'Xử lý ảnh số', 3, 6, 'cs_specialization', false],
  ['TIN4513', 'Bảo mật thông tin', 3, 6, 'cs_specialization', false],
  ['TIN4103', 'Khai phá dữ liệu', 3, 6, 'cs_specialization', true],
  ['TIN4073', 'Phân tích và thiết kế thuật toán', 3, 7, 'cs_specialization', true],
  ['TIN4523', 'Dữ liệu lớn', 3, 7, 'cs_specialization', false],
  ['TIN4543', 'Phát triển ứng dụng trí tuệ nhân tạo', 3, 7, 'cs_specialization', false],
  ['TIN4093', 'Độ phức tạp thuật toán', 3, 7, 'cs_specialization', false],
  ['TIN4263', 'Lập trình logic', 3, 7, 'cs_specialization', false],
  ['TIN4633', 'Xử lý ngôn ngữ tự nhiên', 3, 7, 'cs_specialization', false],
  ['TIN4643', 'Thị giác máy tính', 3, 7, 'cs_specialization', false],
  ['TIN3142', 'Thực tập viết niên luận', 2, 6, 'internship', true],
  ['TIN4014', 'Thực tập tốt nghiệp', 4, 8, 'internship', true],
  ['TIN4713', 'Chuyên đề tốt nghiệp 2', 3, 8, 'graduation', false],
  ['TIN4723', 'Chuyên đề tốt nghiệp 3', 3, 8, 'graduation', false],
  ['TIN4019', 'Khóa luận tốt nghiệp', 10, 8, 'graduation', false],
  ['TIN4054', 'Chuyên đề tốt nghiệp 1', 4, 8, 'graduation', false],
]

const subjectOverrides: Record<string, Partial<CurriculumSubject>> = {
  KNM1013: { completionStatus: 'completed', riskLevel: 'none', grade: { score10: 8.7, letter: 'A', point4: 4.0 }, tags: ['GPA', 'CAREER'] },
  LLCTTH3: { completionStatus: 'completed', riskLevel: 'low', grade: { score10: 7.7, letter: 'B', point4: 3.0 }, tags: ['GPA'] },
  TIN1093: { completionStatus: 'completed', riskLevel: 'high', recoveryAction: 'review_foundation', grade: { score10: 6.5, letter: 'C', point4: 2.0 }, notes: 'Nền tảng cho C++, DSA, CP. Cần ôn lại dù môn đã qua.' },
  TIN3173: { completionStatus: 'completed', riskLevel: 'high', recoveryAction: 'review_foundation', grade: { score10: 6.2, letter: 'C', point4: 2.0 }, notes: 'Cần phục hồi bằng project nhỏ: React components, layout, state, API.' },
  TOA1012: { completionStatus: 'completed', riskLevel: 'critical', recoveryAction: 'improve_if_allowed', grade: { score10: 5.3, letter: 'D', point4: 1.0 }, notes: 'Điểm D. Cần xem quy chế cải thiện/học lại. Dù không học lại, vẫn phải ôn nền toán.' },
  TOA1023: { completionStatus: 'planned', riskLevel: 'watch', recoveryAction: 'protect_next_subjects', notes: 'Nhóm 3. Quan trọng cho AI/ML và phục hồi nền toán.' },
  LLCTKT2: { completionStatus: 'planned', riskLevel: 'low', notes: 'Nhóm 4. Môn nên tận dụng để kéo GPA.' },
  TIN3083: { completionStatus: 'planned', riskLevel: 'watch', recoveryAction: 'protect_next_subjects', notes: 'Nhóm 7. Môn xương sống cho CP và kỹ năng lập trình.' },
  TIN1083: { completionStatus: 'planned', riskLevel: 'watch', recoveryAction: 'protect_next_subjects', notes: 'Nhóm 14. Phải kéo lên B+/A để sửa nền lập trình.' },
  TIN3183: { completionStatus: 'planned', riskLevel: 'watch', notes: 'Nhóm 1. Nền backend và project phần mềm.' },
}

const curriculumSubjectsSeed: CurriculumSubject[] = curriculumSeedRows.map(([code, name, credits, expectedSemester, groupId, required]) => {
  const base: CurriculumSubject = {
    code,
    name,
    credits,
    expectedSemester,
    groupId,
    required,
    completionStatus: 'not_started',
    riskLevel: 'none',
    importance: inferSubjectImportance(code, groupId, required),
    recoveryAction: 'none',
    tags: inferSubjectTags(code, name, groupId),
  }
  return { ...base, ...subjectOverrides[code] }
})

const semesterPlansSeed: SemesterPlan[] = [
  {
    semester: 2,
    academicYear: '2025-2026',
    targetSemesterGPA4: 3.2,
    maxCreditsRecommended: 14,
    subjects: ['LLCTKT2', 'TIN1083', 'TIN3083', 'TIN3183', 'TOA1023'],
    subjectPlans: [
      { subjectCode: 'LLCTKT2', targetGrade: 'A', status: 'exam_review', weeklyHours: 3 },
      { subjectCode: 'TIN1083', targetGrade: 'A', status: 'exam_review', weeklyHours: 5 },
      { subjectCode: 'TIN3083', targetGrade: 'A', status: 'exam_review', weeklyHours: 6 },
      { subjectCode: 'TIN3183', targetGrade: 'B+', status: 'exam_review', weeklyHours: 5 },
      { subjectCode: 'TOA1023', targetGrade: 'B+', status: 'exam_review', weeklyHours: 5 },
    ],
    focus: ['GPA', 'CP', 'CS', 'SE', 'RECOVERY'],
    weeklyRules: [
      'Ưu tiên ôn thi các môn có lịch trong tháng 06/2026.',
      'Không thêm điểm học kỳ 2 cho đến khi có kết quả chính thức.',
      'Tập trung giữ GPA học kỳ 2 cao hơn GPA tích lũy hiện tại.',
    ],
  },
]

const dailyTasksSeed: DailyTask[] = []

const studySessionsSeed: StudySession[] = []
const weeklyFixedEventsSeed: FixedEvent[] = [
  {
    id: 'exam_2026_06_03_tin1083',
    title: 'Thi Kỹ thuật lập trình - Nhóm 14',
    type: 'exam',
    date: '2026-06-03',
    dayOfWeek: 3,
    startTime: '17:30',
    endTime: '19:30',
    subjectCode: 'TIN1083',
    note: 'Phòng E501 - Lab. Hình thức: Làm bài trên máy tính.',
  },
  {
    id: 'exam_2026_06_05_tin3183',
    title: 'Thi Cơ sở dữ liệu - Nhóm 1',
    type: 'exam',
    date: '2026-06-05',
    dayOfWeek: 5,
    startTime: '14:00',
    endTime: '16:00',
    subjectCode: 'TIN3183',
    note: 'Phòng B303. Hình thức: Tự luận.',
  },
  {
    id: 'exam_2026_06_08_llctkt2',
    title: 'Thi Kinh tế chính trị Mác - Lênin - Nhóm 4',
    type: 'exam',
    date: '2026-06-08',
    dayOfWeek: 1,
    startTime: '07:30',
    endTime: '09:30',
    subjectCode: 'LLCTKT2',
    note: 'Phòng E302. Hình thức: Tự luận.',
  },
  {
    id: 'exam_2026_06_10_toa1023',
    title: 'Thi Đại số tuyến tính - Nhóm 3',
    type: 'exam',
    date: '2026-06-10',
    dayOfWeek: 3,
    startTime: '14:00',
    endTime: '16:00',
    subjectCode: 'TOA1023',
    note: 'Phòng F202. Hình thức: Tự luận.',
  },
  {
    id: 'exam_2026_06_13_tin3083',
    title: 'Thi Lập trình nâng cao - Nhóm 7',
    type: 'exam',
    date: '2026-06-13',
    dayOfWeek: 6,
    startTime: '14:00',
    endTime: '16:00',
    subjectCode: 'TIN3083',
    note: 'Phòng E405 - Lab. Hình thức: Làm bài trên máy tính.',
  },
]
const weeklyStudyBlocksSeed: WeeklyStudyBlock[] = []
const pomodoroSessionsSeed: PomodoroSession[] = []

const cpProblemsSeed: CpProblem[] = [
  {
    id: 'cp_template_implementation',
    title: 'Implementation: vòng lặp, mảng, điều kiện',
    platform: 'VNOJ',
    topic: 'implementation',
    difficulty: 'easy',
    status: 'todo',
    note: 'Bài nền tảng để giữ nhịp lập trình C++/Python trước khi lên chủ đề khó hơn.',
  },
  {
    id: 'cp_template_array',
    title: 'Mảng và tiền tố: 2 bài dễ',
    platform: 'Codeforces',
    topic: 'data_structure',
    difficulty: 'easy',
    status: 'todo',
    note: 'Phù hợp với TIN1083/TIN3083, có thể đưa vào hôm nay khi rảnh ôn thi.',
  },
  {
    id: 'cp_template_upsolve',
    title: 'Upsolve một bài đã sai',
    platform: 'Other',
    topic: 'implementation',
    difficulty: 'medium',
    status: 'upsolve',
    note: 'Mỗi bài sai cần ghi lại lỗi và làm lại đến khi tự code được.',
  },
]

const projectsSeed: StudyProject[] = [
  {
    id: 'project_learning_os',
    name: 'Learning OS',
    track: 'frontend',
    status: 'building',
    priority: 'high',
    subjectCode: 'TIN3173',
    goal: 'Dùng chính app này để phục hồi nền Front-End và tổ chức việc học.',
    nextAction: 'Việt hóa các label còn lại và kiểm tra workflow trên mobile.',
    milestones: [
      { id: 'learning_os_nav', title: 'Ổn định 4 workflow chính', done: true },
      { id: 'learning_os_daily', title: 'Làm rõ workflow Hằng ngày', done: false },
      { id: 'learning_os_polish', title: 'Polish mobile và empty states', done: false },
    ],
  },
  {
    id: 'project_database_notes',
    name: 'Database Notes',
    track: 'database',
    status: 'planning',
    priority: 'high',
    subjectCode: 'TIN3183',
    goal: 'Tạo sổ tay Cơ sở dữ liệu trước kỳ thi và dùng lại cho Hệ quản trị CSDL.',
    nextAction: 'Viết 10 câu truy vấn SELECT/JOIN/GROUP BY cơ bản.',
    milestones: [
      { id: 'db_schema', title: 'Tạo 3 schema ví dụ', done: false },
      { id: 'db_queries', title: 'Viết 20 truy vấn luyện tập', done: false },
      { id: 'db_mistakes', title: 'Ghi lại lỗi thường gặp', done: false },
    ],
  },
  {
    id: 'project_small_portfolio',
    name: 'Portfolio nhỏ',
    track: 'portfolio',
    status: 'idea',
    priority: 'medium',
    goal: 'Có một trang giới thiệu đơn giản, đủ để gom project học tập trong 4 năm.',
    nextAction: 'Phác thảo 3 section: giới thiệu, kỹ năng, project.',
    milestones: [
      { id: 'portfolio_outline', title: 'Chốt nội dung trang đầu', done: false },
      { id: 'portfolio_layout', title: 'Dựng layout responsive', done: false },
      { id: 'portfolio_publish', title: 'Build và deploy bản đầu', done: false },
    ],
  },
]
const resourcesSeed: StudyResource[] = []

const settingsSeed: AppSettings = {
  showPlaceholderPages: true,
}

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard')
  const [data, setData] = usePersistentData()
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string | null>(null)
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null)
  const stats = useMemo(() => getStats(data), [data])
  const searchResults = useMemo(() => getGlobalSearchResults(data, searchQuery), [data, searchQuery])
  const workflowHint = getWorkflowHint(activePage)

  const notify = (text: string, tone: ToastMessage['tone'] = 'success') => {
    setToast({ id: Date.now(), text, tone })
  }

  const updateProfile = (academicProfile: AcademicProfile) => setData({ ...data, academicProfile })
  const updateTasks = (dailyTasks: DailyTask[]) => {
    setData({ ...data, dailyTasks })
    notify('Daily Planner updated')
  }
  const updateStudySessions = (studySessions: StudySession[]) => {
    setData({ ...data, studySessions })
    notify('Study session logged')
  }
  const updateWeeklyFixedEvents = (weeklyFixedEvents: FixedEvent[]) => {
    setData({ ...data, weeklyFixedEvents })
    notify('Weekly fixed schedule updated')
  }
  const updateWeeklyStudyBlocks = (weeklyStudyBlocks: WeeklyStudyBlock[]) => {
    setData({ ...data, weeklyStudyBlocks })
    notify('Weekly study plan updated')
  }
  const updateDailyExecution = (dailyTasks: DailyTask[], weeklyStudyBlocks: WeeklyStudyBlock[]) => {
    setData({ ...data, dailyTasks, weeklyStudyBlocks })
    notify('Daily execution updated')
  }
  const updateCpProblems = (cpProblems: CpProblem[]) => {
    setData({ ...data, cpProblems })
    notify('CP Tracker updated')
  }
  const updateProjects = (projects: StudyProject[]) => {
    setData({ ...data, projects })
    notify('Project Lab updated')
  }
  const updateResources = (resources: StudyResource[]) => {
    setData({ ...data, resources })
    notify('Resource Hub updated')
  }
  const updateSettings = (settings: AppSettings) => {
    setData({ ...data, settings })
  }
  const updateSemesterPlans = (semesterPlans: SemesterPlan[]) => {
    setData({ ...data, semesterPlans })
    notify('Semester Planner updated')
  }
  const saveWeeklyReview = (review: WeeklyReview) => {
    const exists = data.weeklyReviews.some((item) => item.id === review.id)
    setData({
      ...data,
      weeklyReviews: exists ? data.weeklyReviews.map((item) => (item.id === review.id ? review : item)) : [review, ...data.weeklyReviews],
    })
    notify('Weekly Review saved')
  }
  const saveDailyReview = (review: DailyReview) => {
    const exists = data.dailyReviews.some((item) => item.date === review.date)
    setData({
      ...data,
      dailyReviews: exists ? data.dailyReviews.map((item) => (item.date === review.date ? review : item)) : [review, ...data.dailyReviews],
    })
    notify('Đã chốt hôm nay')
  }
  const replaceData = (nextData: AppData) => {
    setData(nextData)
    notify('Backup imported')
  }
  const resetData = () => {
    setData(getDefaultData())
    notify('Seed data restored', 'warning')
  }

  const openSearchResult = (result: GlobalSearchResult) => {
    if (result.subjectCode) {
      setSelectedSubjectCode(result.subjectCode)
    }
    setActivePage(result.page)
    setSearchQuery('')
    notify(`Opened ${result.label}`, 'info')
  }

  const openSubject = (subjectCode: string) => {
    setSelectedSubjectCode(subjectCode)
  }

  const addSubjectTask = (subject: CurriculumSubject) => {
    updateTasks(addUniqueDailyTask(data.dailyTasks, {
      title: `Lộ trình: ${subject.code} - ${subject.name}`,
      lane: subject.tags.includes('CP') ? 'CP' : subject.tags.includes('SE') || subject.tags.includes('CS') ? 'CS_SE' : 'GPA',
      subjectCode: subject.code,
      source: 'roadmap',
      dueDate: today,
    }))
  }

  const completeFocusSession = (target: FocusTarget, minutes: number) => {
    const completedAt = new Date().toISOString()
    const nextStudySession: StudySession = {
      id: crypto.randomUUID(),
      date: today,
      lane: target.lane,
      minutes,
      subjectCode: target.subjectCode,
      note: `Pomodoro: ${target.label}`,
    }
    const nextPomodoroSession: PomodoroSession = {
      id: crypto.randomUUID(),
      startedAt: new Date(Date.now() - minutes * 60 * 1000).toISOString(),
      completedAt,
      minutes,
      subjectCode: target.subjectCode,
      taskId: target.taskId,
      studyBlockId: target.studyBlockId,
      label: target.label,
    }
    const taskLinkedBlockId = target.taskId ? data.dailyTasks.find((task) => task.id === target.taskId)?.weeklyBlockId : undefined
    const completedStudyBlockId = target.studyBlockId ?? taskLinkedBlockId
    setData({
      ...data,
      studySessions: [...data.studySessions, nextStudySession],
      pomodoroSessions: [...data.pomodoroSessions, nextPomodoroSession],
      dailyTasks: target.taskId ? data.dailyTasks.map((task) => (task.id === target.taskId ? { ...task, done: true } : task)) : data.dailyTasks,
      weeklyStudyBlocks: completedStudyBlockId ? data.weeklyStudyBlocks.map((block) => (block.id === completedStudyBlockId ? { ...block, done: true } : block)) : data.weeklyStudyBlocks,
    })
    notify('Pomodoro completed and logged')
  }

  return (
    <div className="app-shell h-screen overflow-hidden text-zinc-100">
      <div className="flex h-screen overflow-hidden">
        <aside className="scroll-area sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-zinc-800 bg-zinc-950/90 px-4 py-5 shadow-2xl shadow-black/30 backdrop-blur lg:block">
          <div className="flex min-h-full flex-col">
            <Brand profile={data.academicProfile} />
            <nav className="mt-8 space-y-1.5">
              {getNavItems(data.settings.showPlaceholderPages).map((item) => (
                <NavButton key={item.id} item={item} active={activePage === item.id} onClick={() => setActivePage(item.id)} />
              ))}
            </nav>
            <div className="surface-card mt-auto rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="text-sm font-semibold text-cyan-100">{workflowHint.title}</p>
              <p className="mt-2 text-sm text-zinc-300">{workflowHint.description}</p>
            </div>
          </div>
        </aside>

        <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <header className="z-20 shrink-0 border-b border-zinc-800 bg-zinc-950/80 px-4 py-4 shadow-lg shadow-black/15 backdrop-blur-xl md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-zinc-400">
                  {data.academicProfile.university} · {data.academicProfile.major}
                </p>
                <h1 className="text-2xl font-semibold tracking-normal text-white md:text-3xl">Hoàng Learning OS</h1>
              </div>
              <GlobalSearch query={searchQuery} results={searchResults} onQueryChange={setSearchQuery} onOpenResult={openSearchResult} />
              <div className="surface-card flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-300">
                <CalendarCheck className="h-4 w-4 text-cyan-300" />
                {formatDate(today)}
              </div>
            </div>
          </header>

          <section className="scroll-area min-h-0 flex-1 overflow-y-auto px-4 py-6 pb-40 md:px-8 lg:pb-32">
            {activePage === 'dashboard' && <DailyWorkflowPage data={data} stats={stats} onUpdateTasks={updateTasks} onSaveDailyReview={saveDailyReview} onStartFocus={setFocusTarget} onOpenSubject={openSubject} />}
            {activePage === 'learningPath' && <LearningPathWorkflowPage data={data} stats={stats} onUpdateSemesterPlans={updateSemesterPlans} onUpdateTasks={updateTasks} onSaveReview={saveWeeklyReview} onOpenSubject={openSubject} />}
            {activePage === 'exams' && <ExamSchedulePage data={data} onOpenSubject={openSubject} />}
            {activePage === 'study' && <SimpleStudyPlanPage data={data} onUpdateTasks={updateTasks} onStartFocus={setFocusTarget} onOpenSubject={openSubject} />}
            {activePage === 'gpa' && <SimpleGpaPage data={data} stats={stats} onOpenSubject={openSubject} />}
            {activePage === 'roadmap' && <CurriculumRoadmap data={data} stats={stats} onUpdateTasks={updateTasks} onOpenSubject={openSubject} />}
            {activePage === 'recovery' && <GpaRecoveryMap data={data} stats={stats} onOpenSubject={openSubject} />}
            {activePage === 'semester' && <EditableSemesterPlanner data={data} onUpdateSemesterPlans={updateSemesterPlans} onUpdateTasks={updateTasks} onOpenSubject={openSubject} />}
            {activePage === 'weekly' && <WeeklyReviewPage data={data} onSaveReview={saveWeeklyReview} />}
            {activePage === 'settings' && <SettingsPage data={data} onUpdateProfile={updateProfile} onUpdateSettings={updateSettings} onReplaceData={replaceData} onResetData={resetData} />}
            {activePage === 'daily' && <DailyPlanner data={data} onUpdateTasks={updateTasks} onUpdateStudySessions={updateStudySessions} onUpdateStudyBlocks={updateWeeklyStudyBlocks} onUpdateDailyExecution={updateDailyExecution} onStartFocus={setFocusTarget} onOpenSubject={openSubject} />}
            {activePage === 'weeklyPlan' && <WeeklyPlanPage data={data} onUpdateFixedEvents={updateWeeklyFixedEvents} onUpdateStudyBlocks={updateWeeklyStudyBlocks} onUpdateTasks={updateTasks} onStartFocus={setFocusTarget} onOpenSubject={openSubject} />}
            {activePage === 'cp' && <CpTracker data={data} onUpdateCpProblems={updateCpProblems} onUpdateTasks={updateTasks} onStartFocus={setFocusTarget} />}
            {activePage === 'project' && <ProjectLab data={data} onUpdateProjects={updateProjects} onUpdateTasks={updateTasks} onStartFocus={setFocusTarget} />}
            {activePage === 'resources' && <ResourceHub data={data} onUpdateResources={updateResources} onUpdateTasks={updateTasks} />}
          </section>
        </main>
      </div>

      <nav className="scroll-area fixed inset-x-0 bottom-0 z-30 flex gap-2 overflow-x-auto border-t border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl lg:hidden">
        {getNavItems(true).map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              className={`flex min-h-14 min-w-16 flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs ${activePage === item.id ? 'bg-cyan-400 text-zinc-950' : 'text-zinc-400'}`}
              onClick={() => setActivePage(item.id)}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
              <span className="max-w-full truncate">{item.shortLabel}</span>
            </button>
          )
        })}
      </nav>

      <Toast toast={toast} onDone={() => setToast(null)} />
      <UnifiedFocusTimer key={focusTarget?.label ?? 'no-focus'} target={focusTarget} onClose={() => setFocusTarget(null)} onComplete={completeFocusSession} />
      <SubjectDetailDrawer
        data={data}
        subjectCode={selectedSubjectCode}
        onClose={() => setSelectedSubjectCode(null)}
        onAddTask={addSubjectTask}
        onJump={(page) => setActivePage(page)}
        onUpdateSemesterPlans={updateSemesterPlans}
      />
    </div>
  )
}

function getNavItems(includePlaceholders: boolean): Array<{ id: Page; label: string; shortLabel: string; icon: typeof LayoutDashboard }> {
  void includePlaceholders
  return [
    { id: 'dashboard', label: 'Hằng ngày', shortLabel: 'Hôm nay', icon: LayoutDashboard },
    { id: 'cp', label: 'Luyện CP', shortLabel: 'CP', icon: BarChart3 },
    { id: 'project', label: 'Project', shortLabel: 'Project', icon: BookOpen },
    { id: 'learningPath', label: 'Lộ trình', shortLabel: 'Lộ trình', icon: Map },
    { id: 'settings', label: 'Cài đặt', shortLabel: 'Cài đặt', icon: Settings },
  ]
}

function getWorkflowHint(page: Page) {
  if (page === 'cp') {
    return { title: 'Luyện CP', description: 'Quản lý bài tập, upsolve và đưa bài cần làm vào hôm nay khi cần.' }
  }
  if (page === 'project') {
    return { title: 'Project', description: 'Theo dõi mốc tiến độ, hành động tiếp theo và biến project thành việc cụ thể.' }
  }
  if (page === 'learningPath') {
    return { title: 'Lộ trình học tập', description: 'Nhìn toàn cảnh tín chỉ, học kỳ, môn rủi ro và điều chỉnh dài hạn.' }
  }
  if (page === 'settings') {
    return { title: 'Dữ liệu & hồ sơ', description: 'Backup, import, reset dữ liệu và chỉnh thông tin mục tiêu.' }
  }
  return { title: 'Ôn thi học kỳ 2', description: 'Mở app lên là biết lịch thi gần nhất, việc cần ôn hôm nay, và GPA hiện tại.' }
}

function GlobalSearch({
  query,
  results,
  onQueryChange,
  onOpenResult,
}: {
  query: string
  results: GlobalSearchResult[]
  onQueryChange: (query: string) => void
  onOpenResult: (result: GlobalSearchResult) => void
}) {
  const showResults = query.trim().length > 0

  return (
    <div className="relative order-last w-full md:order-none md:w-[24rem]">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <input
        className="field field-with-left-icon h-11"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Tìm môn, lịch thi, việc ôn..."
        aria-label="Global search"
      />
      {showResults && (
        <div className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40">
          <div className="max-h-80 overflow-y-auto p-2">
            {results.map((result) => (
              <button key={result.id} type="button" className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left hover:bg-zinc-900" onClick={() => onOpenResult(result)}>
                <Search className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">{result.label}</span>
                  <span className="mt-1 block text-xs text-zinc-500">{result.meta}</span>
                </span>
              </button>
            ))}
            {!results.length && <p className="px-3 py-4 text-sm text-zinc-500">No result found.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

function getGlobalSearchResults(data: AppData, query: string): GlobalSearchResult[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const candidates: GlobalSearchResult[] = [
    ...data.curriculumSubjects.map((subject) => ({
      id: `subject-${subject.code}`,
      label: `${subject.code} - ${subject.name}`,
      meta: `Subject | ${subject.completionStatus} | risk ${subject.riskLevel}`,
      page: 'learningPath' as const,
      subjectCode: subject.code,
    })),
    ...data.dailyTasks.map((task) => ({
      id: `task-${task.id}`,
      label: task.title,
      meta: `Daily task | ${task.lane}${task.subjectCode ? ` | ${task.subjectCode}` : ''}`,
      page: 'dashboard' as const,
    })),
    ...data.weeklyFixedEvents.map((event) => ({
      id: `fixed-${event.id}`,
      label: event.title,
      meta: `Fixed schedule | ${formatFixedEventTiming(event)}`,
      page: 'dashboard' as const,
      subjectCode: event.subjectCode,
    })),
    ...data.weeklyStudyBlocks.map((block) => ({
      id: `block-${block.id}`,
      label: `Study ${block.subjectCode}`,
      meta: `Weekly block | ${getWeekDayLabel(block.dayOfWeek)} ${block.startTime}-${block.endTime}`,
      page: 'dashboard' as const,
      subjectCode: block.subjectCode,
    })),
    ...data.cpProblems.map((problem) => ({
      id: `cp-${problem.id}`,
      label: problem.title,
      meta: `CP | ${problem.platform} | ${problem.status}`,
      page: 'cp' as const,
    })),
    ...data.projects.map((project) => ({
      id: `project-${project.id}`,
      label: project.name,
      meta: `Project | ${project.track} | ${project.status}`,
      page: 'project' as const,
    })),
  ]

  return candidates
    .filter((item) => `${item.label} ${item.meta}`.toLowerCase().includes(needle))
    .slice(0, 10)
}

function Toast({ toast, onDone }: { toast: ToastMessage | null; onDone: () => void }) {
  useEffect(() => {
    if (!toast) return
    const timeoutId = window.setTimeout(onDone, 2400)
    return () => window.clearTimeout(timeoutId)
  }, [toast, onDone])

  if (!toast) return null

  const tones = {
    success: 'border-emerald-400/30 bg-emerald-400 text-zinc-950',
    info: 'border-cyan-400/30 bg-cyan-400 text-zinc-950',
    warning: 'border-amber-400/30 bg-amber-300 text-zinc-950',
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-6">
      <div className={`pointer-events-auto flex min-h-12 max-w-[min(92vw,32rem)] items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold shadow-2xl shadow-black/40 ${tones[toast.tone]}`}>
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span>{toast.text}</span>
      </div>
    </div>
  )
}

export function FocusTimer({ target, onClose, onComplete }: { target: FocusTarget | null; onClose: () => void; onComplete: (target: FocusTarget, minutes: number) => void }) {
  const [remaining, setRemaining] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [completedFocusCount, setCompletedFocusCount] = useState(0)
  const [mode, setMode] = useState<'focus' | 'short_break' | 'long_break'>('focus')

  useEffect(() => {
    if (!running || !target) return
    const intervalId = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(intervalId)
          setRunning(false)
          if (mode === 'focus') {
            onComplete(target, 25)
            const nextCount = completedFocusCount + 1
            setCompletedFocusCount(nextCount)
            const nextMode = nextCount % 4 === 0 ? 'long_break' : 'short_break'
            setMode(nextMode)
            setRemaining(nextMode === 'short_break' ? 5 * 60 : 15 * 60)
          } else {
            setMode('focus')
            setRemaining(25 * 60)
          }
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(intervalId)
  }, [running, target, mode, completedFocusCount, onComplete])

  const skipComplete = () => {
    if (!target) return
    if (mode === 'focus') onComplete(target, Math.max(1, Math.round((25 * 60 - remaining) / 60)))
    onClose()
  }

  const switchMode = (nextMode: 'focus' | 'short_break' | 'long_break') => {
    setMode(nextMode)
    setRunning(false)
    setRemaining(nextMode === 'focus' ? 25 * 60 : nextMode === 'short_break' ? 5 * 60 : 15 * 60)
  }

  return (
    <div className="fixed bottom-24 left-1/2 z-40 w-[min(94vw,44rem)] -translate-x-1/2 lg:bottom-5">
      <div className={`surface-card rounded-lg border shadow-2xl shadow-black/40 backdrop-blur-xl ${target ? 'border-cyan-400/30 bg-zinc-950/95' : 'border-zinc-800 bg-zinc-950/95'}`}>
        <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={mode === 'focus' ? 'danger' : 'success'}>{focusModeLabel(mode)}</Badge>
              {target?.subjectCode && <Badge>{target.subjectCode}</Badge>}
              {!target && <Badge>chưa chọn</Badge>}
            </div>
            <h2 className="mt-2 truncate text-base font-semibold text-white">{target?.label ?? 'Chọn task hoặc môn học để bắt đầu Focus'}</h2>
            <p className="mt-1 text-xs text-zinc-500">Một bộ đếm dùng chung cho Hằng ngày, môn học, CP và Project.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} title="Đóng Focus">×</button>
        </div>
        <p className="mt-6 text-center text-6xl font-semibold text-white">{formatTimer(remaining)}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-primary" onClick={() => setRunning(!running)}>{running ? 'Tạm dừng' : 'Bắt đầu'}</button>
          <button type="button" className="chip" onClick={skipComplete}>Ghi nhận</button>
          <button type="button" className="chip" onClick={() => switchMode('focus')}>Focus 25</button>
          <button type="button" className="chip" onClick={() => switchMode('short_break')}>Nghỉ 5</button>
        </div>
      </div>
    </div>
  )
}

function UnifiedFocusTimer({ target, onClose, onComplete }: { target: FocusTarget | null; onClose: () => void; onComplete: (target: FocusTarget, minutes: number) => void }) {
  const [remaining, setRemaining] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [completedFocusCount, setCompletedFocusCount] = useState(0)
  const [mode, setMode] = useState<'focus' | 'short_break' | 'long_break'>('focus')

  useEffect(() => {
    if (!running || !target) return
    const intervalId = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(intervalId)
          setRunning(false)
          if (mode === 'focus') {
            onComplete(target, 25)
            const nextCount = completedFocusCount + 1
            setCompletedFocusCount(nextCount)
            const nextMode = nextCount % 4 === 0 ? 'long_break' : 'short_break'
            setMode(nextMode)
            setRemaining(nextMode === 'short_break' ? 5 * 60 : 15 * 60)
          } else {
            setMode('focus')
            setRemaining(25 * 60)
          }
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(intervalId)
  }, [running, target, mode, completedFocusCount, onComplete])

  const skipComplete = () => {
    if (!target) return
    if (mode === 'focus') onComplete(target, Math.max(1, Math.round((25 * 60 - remaining) / 60)))
    setRunning(false)
    onClose()
  }

  const switchMode = (nextMode: 'focus' | 'short_break' | 'long_break') => {
    setMode(nextMode)
    setRunning(false)
    setRemaining(nextMode === 'focus' ? 25 * 60 : nextMode === 'short_break' ? 5 * 60 : 15 * 60)
  }

  return (
    <div className="fixed bottom-24 left-1/2 z-40 w-[min(94vw,44rem)] -translate-x-1/2 lg:bottom-5">
      <div className={`rounded-lg border shadow-2xl shadow-black/40 ${target ? 'border-cyan-400/30 bg-zinc-950' : 'border-zinc-800 bg-zinc-950/95'}`}>
        <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={mode === 'focus' ? 'danger' : 'success'}>{focusModeLabel(mode)}</Badge>
              {target?.subjectCode && <Badge>{target.subjectCode}</Badge>}
              {!target && <Badge>chưa chọn</Badge>}
            </div>
            <h2 className="mt-2 truncate text-base font-semibold text-white">{target?.label ?? 'Chọn task hoặc môn học để bắt đầu Focus'}</h2>
            <p className="mt-1 text-xs text-zinc-500">Một bộ đếm dùng chung cho Hằng ngày, môn học, CP và Project.</p>
          </div>
          <div className="min-w-[13rem]">
            <p className="text-center text-5xl font-semibold tabular-nums text-white md:text-right">{formatTimer(remaining)}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-end">
              <button type="button" className="btn-primary" disabled={!target} onClick={() => setRunning(!running)}>{running ? 'Tạm dừng' : 'Bắt đầu'}</button>
              <button type="button" className="chip" disabled={!target} onClick={skipComplete}>Ghi nhận</button>
              <button type="button" className="chip" onClick={() => switchMode('focus')}>25</button>
              <button type="button" className="chip" onClick={() => switchMode('short_break')}>Nghỉ 5</button>
              <button type="button" className="chip" onClick={() => switchMode('long_break')}>Nghỉ 15</button>
              {target && <button type="button" className="icon-btn" onClick={onClose} title="Xóa focus">x</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubjectDetailDrawer({
  data,
  subjectCode,
  onClose,
  onAddTask,
  onJump,
  onUpdateSemesterPlans,
}: {
  data: AppData
  subjectCode: string | null
  onClose: () => void
  onAddTask: (subject: CurriculumSubject) => void
  onJump: (page: Page) => void
  onUpdateSemesterPlans: (plans: SemesterPlan[]) => void
}) {
  const subject = subjectCode ? data.curriculumSubjects.find((item) => item.code === subjectCode) : undefined
  if (!subject) return null

  const semesterPlan = data.semesterPlans[0]
  const semesterSubjectPlan = semesterPlan.subjectPlans.find((item) => item.subjectCode === subject.code)
  const subjectTasks = data.dailyTasks.filter((task) => task.subjectCode === subject.code)
  const subjectResources = data.resources.filter((resource) => resource.subjectCode === subject.code)
  const subjectProjects = data.projects.filter((project) => project.subjectCode === subject.code)
  const subjectFixedEvents = data.weeklyFixedEvents.filter((event) => event.subjectCode === subject.code)
  const subjectStudyBlocks = data.weeklyStudyBlocks.filter((block) => block.subjectCode === subject.code)
  const subjectSessions = data.studySessions.filter((session) => session.subjectCode === subject.code)
  const cpItems = subject.tags.includes('CP') ? data.cpProblems.filter((problem) => problem.status !== 'solved').slice(0, 5) : []

  const updateSemesterSubjectStatus = (status: SemesterSubjectPlan['status']) => {
    const nextPlans = data.semesterPlans.map((plan, index) => {
      if (index !== 0) return plan
      const hasSubject = plan.subjectPlans.some((item) => item.subjectCode === subject.code)
      const subjectPlans = hasSubject
        ? plan.subjectPlans.map((item) => (item.subjectCode === subject.code ? { ...item, status } : item))
        : [...plan.subjectPlans, { ...createDefaultSemesterSubjectPlan(subject.code), status }]
      return { ...plan, subjectPlans }
    })
    onUpdateSemesterPlans(nextPlans)
  }

  return (
    <div className="fixed inset-0 z-40">
      <button type="button" className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Đóng chi tiết môn học" />
      <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-xl flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50">
        <div className="shrink-0 border-b border-zinc-800 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge>{subject.code}</Badge>
                <Badge>{subject.credits} TC</Badge>
                <Badge tone={riskTone(subject.riskLevel)}>{subject.riskLevel}</Badge>
                <Badge tone={importanceTone(subject.importance)}>{subject.importance}</Badge>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{subject.name}</h2>
              <p className="mt-1 text-sm text-zinc-400">{getGroupName(subject.groupId, data.requirementGroups)}</p>
            </div>
            <button type="button" className="icon-btn" onClick={onClose} title="Đóng">×</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={() => onAddTask(subject)}>
              <Plus className="h-4 w-4" />
              Đưa vào hôm nay
            </button>
            <button type="button" className="chip" onClick={() => { onJump('learningPath'); onClose() }}>Lộ trình</button>
            <button type="button" className="chip" onClick={() => updateSemesterSubjectStatus('safe')}>Đánh dấu ổn</button>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          <SubjectDrawerSection title="Trạng thái">
            <div className="grid gap-3 sm:grid-cols-2">
              <DrawerFact label="Tiến độ" value={subject.completionStatus} />
              <DrawerFact label="Phục hồi" value={subject.recoveryAction} />
              <DrawerFact label="Trạng thái kỳ này" value={semesterSubjectPlan?.status ?? 'chưa lập'} />
              <DrawerFact label="Target điểm" value={semesterSubjectPlan?.targetGrade ?? 'chưa đặt'} />
            </div>
            {subject.grade && <p className="mt-3 text-sm text-zinc-300">Điểm: {subject.grade.score10}/10 · {subject.grade.letter} · {subject.grade.point4}/4</p>}
            {subject.notes && <p className="mt-3 text-sm text-zinc-400">{subject.notes}</p>}
          </SubjectDrawerSection>

          <SubjectDrawerSection title="Việc hôm nay">
            <DrawerList items={subjectTasks.map((task) => `${task.done ? 'Xong' : 'Đang mở'} · ${task.title}`)} emptyText="Chưa có task hôm nay cho môn này." />
          </SubjectDrawerSection>

          <SubjectDrawerSection title="Tài liệu">
            <DrawerList items={subjectResources.map((resource) => `${resource.status} · ${resource.title}`)} emptyText="Chưa có tài liệu gắn với môn này." />
          </SubjectDrawerSection>

          <SubjectDrawerSection title="Kế hoạch tuần">
            <DrawerList
              items={[
                ...subjectFixedEvents.map((event) => `${formatFixedEventTiming(event)} · ${event.type}: ${event.title}${event.note ? ` · ${event.note}` : ''}`),
                ...subjectStudyBlocks.map((block) => `${getWeekDayLabel(block.dayOfWeek)} ${block.startTime}-${block.endTime} · ${block.done ? 'Xong' : 'Đang mở'} block học`),
              ]}
              emptyText="Chưa có lịch hoặc block học tuần cho môn này."
            />
          </SubjectDrawerSection>

          <SubjectDrawerSection title="Lịch sử học">
            <DrawerList items={subjectSessions.slice(-5).map((session) => `${session.date} · ${session.minutes} phút · ${session.note || session.lane}`)} emptyText="Chưa có phiên học nào cho môn này." />
          </SubjectDrawerSection>

          <SubjectDrawerSection title="Projects">
            <DrawerList items={subjectProjects.map((project) => `${projectStatusLabel(project.status)} · ${project.name}: ${project.nextAction}`)} emptyText="Chưa có project gắn với môn này." />
          </SubjectDrawerSection>

          {subject.tags.includes('CP') && (
            <SubjectDrawerSection title="Hàng đợi CP">
              <DrawerList items={cpItems.map((item) => `${cpStatusLabel(item.status)} · ${item.title}`)} emptyText="Chưa có bài CP đang mở." />
            </SubjectDrawerSection>
          )}
        </div>
      </aside>
    </div>
  )
}

function SubjectDrawerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function DrawerFact({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function DrawerList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (!items.length) return <p className="text-sm text-zinc-500">{emptyText}</p>
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <p key={item} className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">{item}</p>
      ))}
    </div>
  )
}

function usePersistentData() {
  const [data, setDataState] = useState<AppData>(() => loadData())

  const setData = (nextData: AppData) => {
    const normalized = normalizeData(nextData)
    setDataState(normalized)
  }

  useEffect(() => {
    saveData(data)
  }, [data])

  return [data, setData] as const
}

function loadData(): AppData {
  if (localStorage.getItem(STORAGE_KEYS.dataVersion) !== DATA_VERSION) {
    return getDefaultData()
  }

  const loaded = {
    academicProfile: readStorage<AcademicProfile>(STORAGE_KEYS.academicProfile),
    curriculumSubjects: readStorage<CurriculumSubject[]>(STORAGE_KEYS.curriculumSubjects),
    requirementGroups: readStorage<RequirementGroup[]>(STORAGE_KEYS.requirementGroups),
    semesterPlans: readStorage<SemesterPlan[]>(STORAGE_KEYS.semesterPlans),
    dailyTasks: readStorage<DailyTask[]>(STORAGE_KEYS.dailyTasks),
    studySessions: readStorage<StudySession[]>(STORAGE_KEYS.studySessions),
    weeklyFixedEvents: readStorage<FixedEvent[]>(STORAGE_KEYS.weeklyFixedEvents),
    weeklyStudyBlocks: readStorage<WeeklyStudyBlock[]>(STORAGE_KEYS.weeklyStudyBlocks),
    pomodoroSessions: readStorage<PomodoroSession[]>(STORAGE_KEYS.pomodoroSessions),
    cpProblems: readStorage<CpProblem[]>(STORAGE_KEYS.cpProblems),
    projects: readStorage<StudyProject[]>(STORAGE_KEYS.projects),
    resources: readStorage<StudyResource[]>(STORAGE_KEYS.resources),
    weeklyReviews: readStorage<WeeklyReview[]>(STORAGE_KEYS.weeklyReviews),
    dailyReviews: readStorage<DailyReview[]>(STORAGE_KEYS.dailyReviews),
    settings: readStorage<AppSettings>(STORAGE_KEYS.settings),
  }

  return normalizeData({
    academicProfile: loaded.academicProfile ?? academicProfileSeed,
    curriculumSubjects: loaded.curriculumSubjects ?? curriculumSubjectsSeed,
    requirementGroups: loaded.requirementGroups ?? requirementGroupsSeed,
    semesterPlans: loaded.semesterPlans ?? semesterPlansSeed,
    dailyTasks: loaded.dailyTasks ?? dailyTasksSeed,
    studySessions: loaded.studySessions ?? studySessionsSeed,
    weeklyFixedEvents: loaded.weeklyFixedEvents ?? weeklyFixedEventsSeed,
    weeklyStudyBlocks: loaded.weeklyStudyBlocks ?? weeklyStudyBlocksSeed,
    pomodoroSessions: loaded.pomodoroSessions ?? pomodoroSessionsSeed,
    cpProblems: loaded.cpProblems ?? cpProblemsSeed,
    projects: loaded.projects ?? projectsSeed,
    resources: loaded.resources ?? resourcesSeed,
    weeklyReviews: loaded.weeklyReviews ?? [],
    dailyReviews: loaded.dailyReviews ?? [],
    settings: loaded.settings ?? settingsSeed,
  })
}

function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEYS.dataVersion, DATA_VERSION)
  localStorage.setItem(STORAGE_KEYS.academicProfile, JSON.stringify(data.academicProfile))
  localStorage.setItem(STORAGE_KEYS.curriculumSubjects, JSON.stringify(data.curriculumSubjects))
  localStorage.setItem(STORAGE_KEYS.requirementGroups, JSON.stringify(data.requirementGroups))
  localStorage.setItem(STORAGE_KEYS.semesterPlans, JSON.stringify(data.semesterPlans))
  localStorage.setItem(STORAGE_KEYS.dailyTasks, JSON.stringify(data.dailyTasks))
  localStorage.setItem(STORAGE_KEYS.studySessions, JSON.stringify(data.studySessions))
  localStorage.setItem(STORAGE_KEYS.weeklyFixedEvents, JSON.stringify(data.weeklyFixedEvents))
  localStorage.setItem(STORAGE_KEYS.weeklyStudyBlocks, JSON.stringify(data.weeklyStudyBlocks))
  localStorage.setItem(STORAGE_KEYS.pomodoroSessions, JSON.stringify(data.pomodoroSessions))
  localStorage.setItem(STORAGE_KEYS.cpProblems, JSON.stringify(data.cpProblems))
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(data.projects))
  localStorage.setItem(STORAGE_KEYS.resources, JSON.stringify(data.resources))
  localStorage.setItem(STORAGE_KEYS.weeklyReviews, JSON.stringify(data.weeklyReviews))
  localStorage.setItem(STORAGE_KEYS.dailyReviews, JSON.stringify(data.dailyReviews))
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(data.settings))
}

function normalizeData(value: Partial<AppData>): AppData {
  const profile = isAcademicProfile(value.academicProfile) ? value.academicProfile : academicProfileSeed
  return {
    academicProfile: profile,
    curriculumSubjects: Array.isArray(value.curriculumSubjects) && value.curriculumSubjects.some((subject) => subject.code === 'TOA1012') ? value.curriculumSubjects : curriculumSubjectsSeed,
    requirementGroups: Array.isArray(value.requirementGroups) && value.requirementGroups.length ? value.requirementGroups : requirementGroupsSeed,
    semesterPlans: normalizeSemesterPlans(Array.isArray(value.semesterPlans) && value.semesterPlans.length ? value.semesterPlans : semesterPlansSeed),
    dailyTasks: Array.isArray(value.dailyTasks) ? value.dailyTasks : dailyTasksSeed,
    studySessions: Array.isArray(value.studySessions) ? value.studySessions : studySessionsSeed,
    weeklyFixedEvents: Array.isArray(value.weeklyFixedEvents) ? value.weeklyFixedEvents : weeklyFixedEventsSeed,
    weeklyStudyBlocks: Array.isArray(value.weeklyStudyBlocks) ? value.weeklyStudyBlocks : weeklyStudyBlocksSeed,
    pomodoroSessions: Array.isArray(value.pomodoroSessions) ? value.pomodoroSessions : pomodoroSessionsSeed,
    cpProblems: Array.isArray(value.cpProblems) ? value.cpProblems : cpProblemsSeed,
    projects: Array.isArray(value.projects) ? value.projects : projectsSeed,
    resources: Array.isArray(value.resources) ? value.resources : resourcesSeed,
    weeklyReviews: Array.isArray(value.weeklyReviews) ? value.weeklyReviews : [],
    dailyReviews: Array.isArray(value.dailyReviews) ? value.dailyReviews : [],
    settings: normalizeSettings(value.settings),
  }
}

function normalizeSettings(value: unknown): AppSettings {
  if (!value || typeof value !== 'object') return settingsSeed
  const candidate = value as Partial<AppSettings>
  return {
    showPlaceholderPages: typeof candidate.showPlaceholderPages === 'boolean' ? candidate.showPlaceholderPages : settingsSeed.showPlaceholderPages,
    lastBackupAt: typeof candidate.lastBackupAt === 'string' ? candidate.lastBackupAt : undefined,
    lastBackupFileName: typeof candidate.lastBackupFileName === 'string' ? candidate.lastBackupFileName : undefined,
    lastImportAt: typeof candidate.lastImportAt === 'string' ? candidate.lastImportAt : undefined,
  }
}

function isAcademicProfile(value: unknown): value is AcademicProfile {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<AcademicProfile>
  return candidate.minimumRequiredCredits === 122 && typeof candidate.cumulativeGPA4 === 'number' && Array.isArray(candidate.selectedSpecializationGroupIds)
}

function normalizeSemesterPlans(plans: SemesterPlan[]): SemesterPlan[] {
  return plans.map((plan) => {
    const subjectPlans = Array.isArray(plan.subjectPlans) ? plan.subjectPlans : []
    const normalizedSubjectPlans = plan.subjects.map((subjectCode) => {
      const existing = subjectPlans.find((item) => item.subjectCode === subjectCode)
      return existing ?? {
        subjectCode,
        targetGrade: 'B+' as const,
        status: 'not_started' as const,
        weeklyHours: 3,
      }
    })
    return { ...plan, subjectPlans: normalizedSubjectPlans }
  })
}

function getDefaultData(): AppData {
  return {
    academicProfile: academicProfileSeed,
    curriculumSubjects: curriculumSubjectsSeed,
    requirementGroups: requirementGroupsSeed,
    semesterPlans: semesterPlansSeed,
    dailyTasks: dailyTasksSeed,
    studySessions: studySessionsSeed,
    weeklyFixedEvents: weeklyFixedEventsSeed,
    weeklyStudyBlocks: weeklyStudyBlocksSeed,
    pomodoroSessions: pomodoroSessionsSeed,
    cpProblems: cpProblemsSeed,
    projects: projectsSeed,
    resources: resourcesSeed,
    weeklyReviews: [],
    dailyReviews: [],
    settings: settingsSeed,
  }
}

function Dashboard({ data, stats, onUpdateTasks, onOpenSubject }: { data: AppData; stats: ReturnType<typeof getStats>; onUpdateTasks: (tasks: DailyTask[]) => void; onOpenSubject: (subjectCode: string) => void }) {
  const profile = data.academicProfile
  const recoverySubjects = data.curriculumSubjects.filter((subject) => subject.recoveryAction !== 'none')
  const semesterPlan = data.semesterPlans[0]
  const semesterSubjects = semesterPlan.subjects
    .map((code) => data.curriculumSubjects.find((subject) => subject.code === code))
    .filter((subject): subject is CurriculumSubject => Boolean(subject))
  const projectedSemesterGPA = calculateProjectedSemesterGPA(semesterSubjects, semesterPlan.subjectPlans)
  const upsolveQueue = data.cpProblems.filter((problem) => problem.status === 'upsolve')
  const activeProjects = data.projects.filter((project) => project.status !== 'done')
  const activeResources = data.resources.filter((resource) => resource.status === 'using')
  const nextCpProblem = upsolveQueue[0] ?? data.cpProblems.find((problem) => problem.status === 'todo')
  const nextProject = [...activeProjects].sort((a, b) => projectPriorityScore(b.priority) - projectPriorityScore(a.priority))[0]
  const nextResource = activeResources[0] ?? data.resources.find((resource) => resource.status === 'saved')
  const nextRiskSubject = stats.riskAlerts[0]
  const now = new Date()
  const todayDay = getIsoDay(now)
  const todayFixedEvents = data.weeklyFixedEvents.filter((event) => isEventOnDate(event, now)).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
  const nextStudyBlock = data.weeklyStudyBlocks
    .filter((block) => block.dayOfWeek === todayDay && !block.done)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))[0]

  const toggleTask = (taskId: string) => {
    onUpdateTasks(data.dailyTasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)))
  }

  const addTask = (task: Omit<DailyTask, 'id' | 'done'>) => {
    onUpdateTasks([...data.dailyTasks, { ...task, id: crypto.randomUUID(), done: false }])
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg border border-cyan-400/20 p-5">
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="success">GPA first</Badge>
              <Badge>{todayFixedEvents.length} fixed today</Badge>
              <Badge>{data.weeklyStudyBlocks.filter((block) => block.dayOfWeek === todayDay && !block.done).length} study blocks</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Operate today from one flow</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">Check fixed schedule, pick the next GPA block, convert it to a daily task, then run the shared Pomodoro timer.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {['Schedule', 'Daily task', 'Focus timer'].map((item, index) => (
              <div key={item} className="surface-card rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-cyan-400 text-sm font-bold text-zinc-950">{index + 1}</span>
                  <p className="font-semibold text-white">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={GraduationCap} label="Current GPA" value={`${stats.currentGPA.toFixed(2)}/4.00`} helper={`Hệ 10: ${profile.cumulativeGPA10?.toFixed(2) ?? '6.99'}`} />
        <MetricCard icon={BarChart3} label="Credit Progress" value={`${stats.creditProgress.completedCredits}/${stats.creditProgress.minimumRequiredCredits}`} helper={`${stats.creditProgress.percent}% complete`} />
        <MetricCard icon={AlertTriangle} label="Academic Phase" value="Exam review" helper="Học kỳ 2 chưa có điểm" />
        <MetricCard icon={Target} label="Semester Target" value={`>= ${profile.targetScholarshipGPA4.toFixed(2)}`} helper="Kỳ 2 target GPA" />
      </div>

      <Panel title="Command Center" subtitle="One-click actions from active queues">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DashboardAction
            title={`Projected semester GPA: ${projectedSemesterGPA.toFixed(2)}`}
            meta={`Target ${semesterPlan.targetSemesterGPA4.toFixed(2)}`}
            tone={projectedSemesterGPA >= semesterPlan.targetSemesterGPA4 ? 'success' : 'warning'}
            onClick={() => addTask({ title: 'Review semester plan and adjust weak subjects', lane: 'GPA' })}
          />
          {nextRiskSubject && (
            <DashboardAction
              title={`Study ${nextRiskSubject.code}`}
              meta="Risk subject"
              tone="danger"
              onClick={() => addTask({ title: `Risk: study ${nextRiskSubject.code} - ${nextRiskSubject.name}`, lane: nextRiskSubject.tags.includes('CP') ? 'CP' : nextRiskSubject.tags.includes('SE') || nextRiskSubject.tags.includes('CS') ? 'CS_SE' : 'GPA', subjectCode: nextRiskSubject.code })}
            />
          )}
          {nextStudyBlock && (
            <DashboardAction
              title={`${nextStudyBlock.startTime}-${nextStudyBlock.endTime} ${nextStudyBlock.subjectCode}`}
              meta="Next study block"
              tone="success"
              onClick={() => addTask({ title: `Weekly Plan: ${nextStudyBlock.subjectCode}`, lane: nextStudyBlock.lane, subjectCode: nextStudyBlock.subjectCode })}
            />
          )}
          {nextCpProblem && (
            <DashboardAction
              title={`CP: ${nextCpProblem.title}`}
              meta={nextCpProblem.status === 'upsolve' ? 'Upsolve first' : 'CP todo'}
              tone="warning"
              onClick={() => addTask({ title: `CP: ${nextCpProblem.title}`, lane: 'CP', subjectCode: 'TIN3083' })}
            />
          )}
          {nextProject && (
            <DashboardAction
              title={nextProject.nextAction}
              meta={`Project: ${nextProject.name}`}
              tone="default"
              onClick={() => addTask({ title: `Project: ${nextProject.nextAction}`, lane: nextProject.track === 'frontend' || nextProject.track === 'fullstack' || nextProject.track === 'portfolio' ? 'CS_SE' : 'GPA', subjectCode: nextProject.subjectCode })}
            />
          )}
          {nextResource && (
            <DashboardAction
              title={nextResource.title}
              meta={`Resource: ${nextResource.area}`}
              tone="success"
              onClick={() => addTask({ title: `Resource: ${nextResource.title}`, lane: nextResource.area === 'CP' ? 'CP' : nextResource.area === 'CS' || nextResource.area === 'SE' ? 'CS_SE' : 'GPA', subjectCode: nextResource.subjectCode })}
            />
          )}
        </div>
      </Panel>

      <Panel title="Today Schedule" subtitle="Fixed events and generated study blocks">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {todayFixedEvents.map((event) => (
            <div key={event.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{event.type}</Badge>
                {event.subjectCode && <Badge>{event.subjectCode}</Badge>}
              </div>
              <p className="mt-2 font-semibold text-white">{formatFixedEventTiming(event)}</p>
              <p className="text-sm text-zinc-300">{event.title}</p>
              {event.note && <p className="mt-1 text-xs text-zinc-500">{event.note}</p>}
            </div>
          ))}
          {data.weeklyStudyBlocks.filter((block) => block.dayOfWeek === todayDay).map((block) => (
            <button key={block.id} type="button" className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-3 text-left hover:border-cyan-300" onClick={() => addTask({ title: `Weekly Plan: ${block.subjectCode}`, lane: block.lane, subjectCode: block.subjectCode })}>
              <div className="flex flex-wrap gap-2">
                <Badge>{block.done ? 'done' : 'study'}</Badge>
                <Badge>{block.subjectCode}</Badge>
              </div>
              <p className="mt-2 font-semibold text-white">{block.startTime}-{block.endTime}</p>
              <p className="text-sm text-cyan-100">{block.reason}</p>
            </button>
          ))}
          {!todayFixedEvents.length && !data.weeklyStudyBlocks.some((block) => block.dayOfWeek === todayDay) && <EmptyState text="No fixed event or study block today." />}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Today Focus" subtitle="3 việc quan trọng nhất: GPA, CP/programming, CS/SE">
          <div className="grid gap-3">
            {data.dailyTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${task.done ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-zinc-800 bg-zinc-900/70 hover:border-cyan-400/50'}`}
                onClick={() => toggleTask(task.id)}
              >
                <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${task.done ? 'text-emerald-300' : 'text-zinc-500'}`} />
                <span>
                  <span className="flex flex-wrap items-center gap-2">
                    <Badge tone={task.lane === 'GPA' ? 'danger' : task.lane === 'CP' ? 'warning' : 'default'}>{task.lane}</Badge>
                    {task.subjectCode && <Badge>{task.subjectCode}</Badge>}
                  </span>
                  <span className="mt-2 block font-medium text-white">{task.title}</span>
                </span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Risk Alerts" subtitle="Không hiện risk none; low chỉ monitor nhẹ">
          <div className="space-y-3">
            {stats.riskAlerts.map((subject) => (
              <SubjectAlert key={subject.code} subject={subject} onOpenSubject={onOpenSubject} />
            ))}
            {!stats.riskAlerts.length && <EmptyState text="Không có risk watch/high/critical." />}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="GPA Recovery Summary" subtitle="Mục tiêu phục hồi từ 2.50/4.00">
          <Progress value={(stats.currentGPA / profile.targetShortTermGPA4) * 100} />
          <p className="mt-3 text-sm text-zinc-300">
            Cần trung bình <strong className="text-white">{requiredFutureGPA(profile.targetShortTermGPA4, stats.currentGPA, stats.completedCredits, profile.minimumRequiredCredits).toFixed(2)}</strong> cho phần tín chỉ còn lại để đạt 3.00.
          </p>
        </Panel>

        <Panel title="Recovery Subjects" subtitle="Các môn đã qua nhưng vẫn cần xử lý">
          <div className="space-y-2">
            {recoverySubjects.map((subject) => (
              <div key={subject.code} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={subject.riskLevel === 'critical' ? 'danger' : 'warning'}>{subject.riskLevel}</Badge>
                  <Badge>{subject.recoveryAction}</Badge>
                </div>
                <button type="button" className="mt-2 text-left font-medium text-white hover:text-cyan-200" onClick={() => onOpenSubject(subject.code)}>{subject.code} · {subject.name}</button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Next Semester Goal" subtitle="Học kỳ 2, 2025-2026">
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>No subject below B.</li>
            <li>Semester GPA target: &gt;= 3.20.</li>
            <li>At least 2 critical subjects reach A/A-.</li>
            <li>Protect programming foundation.</li>
          </ul>
        </Panel>
      </div>
    </div>
  )
}

function DashboardAction({
  title,
  meta,
  tone,
  onClick,
}: {
  title: string
  meta: string
  tone: 'default' | 'success' | 'warning' | 'danger'
  onClick: () => void
}) {
  const tones = {
    default: 'border-zinc-800 bg-zinc-950 hover:border-cyan-400/60',
    success: 'border-emerald-400/30 bg-emerald-400/10 hover:border-emerald-300',
    warning: 'border-amber-400/30 bg-amber-400/10 hover:border-amber-300',
    danger: 'border-red-400/30 bg-red-400/10 hover:border-red-300',
  }
  return (
    <button type="button" className={`interactive-card surface-card rounded-lg border p-4 text-left ${tones[tone]}`} onClick={onClick}>
      <div className="flex items-center justify-between gap-3">
        <Badge tone={tone}>{meta}</Badge>
        <span className="grid h-8 w-8 place-items-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-300">
          <Plus className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm font-semibold text-white">{title}</p>
    </button>
  )
}

function DailyWorkflowPage({
  data,
  stats,
  onUpdateTasks,
  onSaveDailyReview,
  onStartFocus,
  onOpenSubject,
}: {
  data: AppData
  stats: ReturnType<typeof getStats>
  onUpdateTasks: (tasks: DailyTask[]) => void
  onSaveDailyReview: (review: DailyReview) => void
  onStartFocus: (target: FocusTarget) => void
  onOpenSubject: (subjectCode: string) => void
}) {
  const [section, setSection] = useState<'today' | 'exams' | 'study' | 'gpa'>('today')
  const sections = [
    { id: 'today', label: 'Hôm nay' },
    { id: 'exams', label: 'Lịch thi' },
    { id: 'study', label: 'Ôn tập' },
    { id: 'gpa', label: 'GPA' },
  ] as const

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {sections.map((item) => (
          <button key={item.id} type="button" className={`chip ${section === item.id ? 'chip-active' : ''}`} onClick={() => setSection(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      {section === 'today' && <DailyWorkflowOverview data={data} stats={stats} onUpdateTasks={onUpdateTasks} onSaveDailyReview={onSaveDailyReview} onStartFocus={onStartFocus} onOpenSubject={onOpenSubject} />}
      {section === 'exams' && <ExamSchedulePage data={data} onOpenSubject={onOpenSubject} />}
      {section === 'study' && <SimpleStudyPlanPage data={data} onUpdateTasks={onUpdateTasks} onStartFocus={onStartFocus} onOpenSubject={onOpenSubject} />}
      {section === 'gpa' && <SimpleGpaPage data={data} stats={stats} onOpenSubject={onOpenSubject} />}
    </div>
  )
}

function DailyWorkflowOverview({
  data,
  stats,
  onUpdateTasks,
  onSaveDailyReview,
  onStartFocus,
  onOpenSubject,
}: {
  data: AppData
  stats: ReturnType<typeof getStats>
  onUpdateTasks: (tasks: DailyTask[]) => void
  onSaveDailyReview: (review: DailyReview) => void
  onStartFocus: (target: FocusTarget) => void
  onOpenSubject: (subjectCode: string) => void
}) {
  const exams = getExamEvents(data)
  const nextExam = exams.find((event) => getDaysUntil(event.date) >= 0) ?? exams[0]
  const examSubject = nextExam?.subjectCode ? data.curriculumSubjects.find((subject) => subject.code === nextExam.subjectCode) : undefined
  const nextExamReviewStatus = nextExam ? getExamReviewStatus(nextExam, data) : null
  const examReviewTasks = data.dailyTasks.filter((task) => task.lane === 'GPA')
  const activeExamTasks = examReviewTasks.filter((task) => !task.done)
  const completedExamTasks = examReviewTasks.filter((task) => task.done)
  const recommendedTasks = getRecommendedDailyTasks(data).slice(0, 4)
  const dailySummary = getDailyReviewSummary(data)
  const todayReview = data.dailyReviews.find((review) => review.date === today)
  const recentProgress = getRecentDailyProgress(data)
  const weeklyFocusMinutes = recentProgress.reduce((sum, item) => sum + item.focusMinutes, 0)
  const weeklyDoneTasks = recentProgress.reduce((sum, item) => sum + item.doneTasks, 0)
  const weeklyTotalTasks = recentProgress.reduce((sum, item) => sum + item.totalTasks, 0)

  const addNextExamTask = () => {
    if (!nextExam?.subjectCode) return
    onUpdateTasks(addUniqueDailyTask(data.dailyTasks, {
      title: `Ôn thi: ${nextExam.subjectCode}${examSubject ? ` - ${examSubject.name}` : ''}`,
      lane: 'GPA',
      subjectCode: nextExam.subjectCode,
      source: 'exam',
      dueDate: today,
    }))
  }

  const toggleTask = (taskId: string) => {
    onUpdateTasks(data.dailyTasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)))
  }

  const removeTask = (taskId: string) => {
    onUpdateTasks(data.dailyTasks.filter((task) => task.id !== taskId))
  }

  const closeToday = () => {
    onSaveDailyReview(createDailyReview(data))
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg border border-cyan-400/20 p-5">
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="success">Workflow hằng ngày</Badge>
              <Badge>{activeExamTasks.length} việc ôn đang mở</Badge>
              <Badge>{completedExamTasks.length} đã xong</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Hôm nay cần ôn gì?</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">Luồng này chỉ tập trung GPA và ôn thi. CP và Project có workflow riêng, chỉ xuất hiện ở đây khi bạn chủ động đưa task vào hôm nay.</p>
          </div>
          {nextExam && (
            <div className="surface-card rounded-lg border border-cyan-400/40 bg-cyan-400/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Môn sắp thi nhất</p>
              {nextExamReviewStatus && <div className="mt-2"><Badge tone={examReviewTone(nextExamReviewStatus)}>{nextExamReviewStatus}</Badge></div>}
              <button type="button" className="mt-2 text-left text-lg font-semibold text-white hover:text-cyan-200" onClick={() => nextExam.subjectCode && onOpenSubject(nextExam.subjectCode)}>
                {nextExam.subjectCode} · {examSubject?.name ?? nextExam.title}
              </button>
              <p className="mt-2 text-sm text-cyan-200">{formatFixedEventTiming(nextExam)}</p>
              <p className="mt-1 text-sm text-zinc-400">{getDaysUntil(nextExam.date) < 0 ? 'Đã thi' : `Còn ${getDaysUntil(nextExam.date)} ngày`}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="btn-primary" onClick={addNextExamTask}>
                  <Plus className="h-4 w-4" />
                  Thêm việc ôn
                </button>
                <button type="button" className="chip" onClick={() => onStartFocus({ label: `Ôn thi: ${nextExam.subjectCode ?? nextExam.title}`, lane: 'GPA', subjectCode: nextExam.subjectCode })}>
                  Focus
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Panel title="Việc nên làm tiếp theo" subtitle="Tự ưu tiên từ lịch thi, GPA, CP, Project và Lộ trình">
        <div className="grid gap-3">
          {recommendedTasks.map((task, index) => (
            <div key={task.id} className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={index === 0 ? 'warning' : 'default'}>{index === 0 ? 'ưu tiên nhất' : dailyTaskSourceLabel(task.source)}</Badge>
                    <Badge>{task.lane}</Badge>
                    {task.subjectCode && <button type="button" onClick={() => onOpenSubject(task.subjectCode!)}><Badge>{task.subjectCode}</Badge></button>}
                  </div>
                  <p className="mt-2 font-semibold text-white">{task.title}</p>
                  <p className="mt-1 text-sm text-cyan-100">{getDailyTaskReason(task, data)}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button type="button" className="btn-primary" onClick={() => onStartFocus({ label: task.title, lane: task.lane, subjectCode: task.subjectCode, taskId: task.id, studyBlockId: task.weeklyBlockId })}>
                    Focus
                  </button>
                  <button type="button" className="chip" onClick={() => toggleTask(task.id)}>Xong</button>
                  <button type="button" className="chip" onClick={() => removeTask(task.id)}>Bỏ khỏi hôm nay</button>
                </div>
              </div>
            </div>
          ))}
          {!recommendedTasks.length && (
            <EmptyState text={nextExam ? 'Chưa có task hôm nay. Bấm “Thêm việc ôn” ở môn sắp thi nhất để bắt đầu.' : 'Chưa có việc nào cho hôm nay.'} />
          )}
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={GraduationCap} label="GPA hệ 4" value={stats.currentGPA.toFixed(2)} helper={`Hệ 10: ${data.academicProfile.cumulativeGPA10?.toFixed(2) ?? '6.99'}`} />
        <MetricCard icon={BarChart3} label="Tín chỉ đã có điểm" value={stats.completedCredits} helper="Học kỳ 1 đã hoàn thành" />
        <MetricCard icon={CalendarCheck} label="Lịch thi" value={exams.length} helper={nextExam ? `gần nhất ${nextExam.subjectCode}` : 'chưa có lịch'} />
        <MetricCard icon={ListChecks} label="Việc ôn GPA" value={activeExamTasks.length} helper="không tính CP/Project" />
      </div>

      <Panel title="Việc ôn hôm nay" subtitle="Chỉ hiển thị task GPA/ôn thi để tránh nhiễu workflow">
        <div className="grid gap-3">
          {examReviewTasks.map((task) => (
            <div key={task.id} className={`flex flex-wrap items-start gap-3 rounded-lg border p-4 ${task.done ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-zinc-800 bg-zinc-950'}`}>
              <button type="button" className="mt-0.5" onClick={() => toggleTask(task.id)} title={task.done ? 'Đánh dấu chưa xong' : 'Đánh dấu xong'}>
                <CheckCircle2 className={`h-5 w-5 ${task.done ? 'text-emerald-300' : 'text-zinc-500'}`} />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <Badge>{task.lane}</Badge>
                  {task.subjectCode && <button type="button" onClick={() => onOpenSubject(task.subjectCode!)}><Badge>{task.subjectCode}</Badge></button>}
                </div>
                <p className={`mt-2 font-medium ${task.done ? 'text-emerald-100 line-through decoration-emerald-300/70' : 'text-white'}`}>{task.title}</p>
              </div>
              <button type="button" className="btn-primary" onClick={() => onStartFocus({ label: task.title, lane: task.lane, subjectCode: task.subjectCode, taskId: task.id })}>Focus</button>
              <button type="button" className="icon-btn" onClick={() => removeTask(task.id)} title="Xóa"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {!examReviewTasks.length && <EmptyState text="Chưa có việc ôn GPA hôm nay. Thêm từ môn sắp thi nhất hoặc tab Ôn tập." />}
        </div>
      </Panel>

      <Panel title="Chốt ngày" subtitle="Tổng kết nhanh để biết hôm nay đã làm gì và mai tiếp tục gì">
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard icon={CheckCircle2} label="Task đã xong" value={`${dailySummary.doneTasks}/${dailySummary.totalTasks}`} helper={`${dailySummary.openTasks} việc còn mở`} />
            <MetricCard icon={Target} label="Phút Focus" value={dailySummary.focusMinutes} helper="ghi nhận hôm nay" />
            <MetricCard icon={BookOpen} label="Môn đã đụng tới" value={dailySummary.subjects.length} helper={dailySummary.subjects.slice(0, 2).join(', ') || 'chưa có'} />
            <MetricCard icon={ListChecks} label="CP / Project" value={`${dailySummary.cpTasks.length}/${dailySummary.projectTasks.length}`} helper="được đưa vào hôm nay" />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">Gợi ý ngày mai</p>
                <p className="mt-1 text-sm text-zinc-400">{todayReview ? `Đã chốt lúc ${new Date(todayReview.savedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'Chưa chốt hôm nay'}</p>
              </div>
              <button type="button" className="btn-primary" onClick={closeToday}>
                <Save className="h-4 w-4" />
                Chốt hôm nay
              </button>
            </div>
            <div className="mt-4 grid gap-2">
              {dailySummary.tomorrowSuggestions.map((item) => (
                <p key={item} className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">{item}</p>
              ))}
              {!dailySummary.tomorrowSuggestions.length && <p className="text-sm text-zinc-500">Không còn việc mở. Mai bắt đầu từ lịch thi gần nhất.</p>}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Tiến độ gần đây" subtitle="7 ngày gần nhất từ Daily Review và dữ liệu hôm nay">
        <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <MetricCard icon={CheckCircle2} label="Task 7 ngày" value={`${weeklyDoneTasks}/${weeklyTotalTasks}`} helper={`${weeklyTotalTasks ? Math.round((weeklyDoneTasks / weeklyTotalTasks) * 100) : 0}% hoàn thành`} />
            <MetricCard icon={Target} label="Focus 7 ngày" value={`${weeklyFocusMinutes}p`} helper="tổng phút đã ghi nhận" />
            <MetricCard icon={BookOpen} label="Ngày có học" value={recentProgress.filter((item) => item.focusMinutes > 0 || item.doneTasks > 0).length} helper="trong 7 ngày gần nhất" />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="grid min-h-44 grid-cols-7 items-end gap-2">
              {recentProgress.map((item) => (
                <div key={item.date} className="flex min-w-0 flex-col items-center gap-2">
                  <div className="flex h-28 w-full items-end rounded-md bg-zinc-900 p-1">
                    <div
                      className={`w-full rounded-sm ${item.doneTasks || item.focusMinutes ? 'bg-cyan-400' : 'bg-zinc-700'}`}
                      style={{ height: `${Math.max(8, Math.min(100, item.completionPercent || Math.min(100, item.focusMinutes * 2)))}%` }}
                      title={`${formatShortDate(item.date)}: ${item.doneTasks}/${item.totalTasks} task, ${item.focusMinutes} phút`}
                    />
                  </div>
                  <p className="text-xs text-zinc-500">{formatShortDate(item.date)}</p>
                  <p className="text-xs font-medium text-zinc-300">{item.doneTasks}/{item.totalTasks}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {recentProgress.slice().reverse().slice(0, 4).map((item) => (
                <div key={`detail-${item.date}`} className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{formatShortDate(item.date)}</Badge>
                    <Badge>{item.focusMinutes} phút</Badge>
                    <Badge>{item.carryOverCount} nợ</Badge>
                  </div>
                  <p className="mt-2 truncate text-sm text-zinc-300">{item.subjects.join(', ') || 'Chưa ghi môn học'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}

function ExamSchedulePage({ data, onOpenSubject }: { data: AppData; onOpenSubject: (subjectCode: string) => void }) {
  const exams = getExamEvents(data)
  const nextExam = exams.find((event) => getDaysUntil(event.date) >= 0) ?? exams[0]

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg border border-cyan-400/20 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="success">Lịch thi thật</Badge>
              <Badge>{exams.length} môn</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Lịch thi học kỳ 2</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">Chỉ giữ thông tin cần dùng trước khi thi: ngày giờ, phòng, hình thức và môn gần nhất.</p>
          </div>
          {nextExam && (
            <div className="surface-card rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Môn gần nhất</p>
              <p className="mt-2 text-lg font-semibold text-white">{nextExam.subjectCode}</p>
              <p className="mt-1 text-sm text-cyan-200">{formatFixedEventTiming(nextExam)}</p>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {exams.map((event) => {
          const subject = event.subjectCode ? data.curriculumSubjects.find((item) => item.code === event.subjectCode) : undefined
          const daysLeft = getDaysUntil(event.date)
          const reviewStatus = getExamReviewStatus(event, data)
          return (
            <article key={event.id} className="surface-card rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={daysLeft >= 0 && daysLeft <= 3 ? 'danger' : daysLeft >= 0 && daysLeft <= 7 ? 'warning' : 'default'}>
                  {daysLeft < 0 ? 'Đã qua' : `${daysLeft} ngày nữa`}
                </Badge>
                <Badge tone={examReviewTone(reviewStatus)}>{reviewStatus}</Badge>
                {event.subjectCode && <Badge>{event.subjectCode}</Badge>}
              </div>
              <button type="button" className="mt-3 text-left text-lg font-semibold text-white hover:text-cyan-200" onClick={() => event.subjectCode && onOpenSubject(event.subjectCode)}>
                {subject?.name ?? event.title}
              </button>
              <p className="mt-2 text-sm text-cyan-200">{formatFixedEventTiming(event)}</p>
              {event.note && <p className="mt-3 text-sm text-zinc-300">{event.note}</p>}
            </article>
          )
        })}
      </div>
    </div>
  )
}

function SimpleStudyPlanPage({
  data,
  onUpdateTasks,
  onStartFocus,
  onOpenSubject,
}: {
  data: AppData
  onUpdateTasks: (tasks: DailyTask[]) => void
  onStartFocus: (target: FocusTarget) => void
  onOpenSubject: (subjectCode: string) => void
}) {
  const exams = getExamEvents(data).filter((event) => getDaysUntil(event.date) >= 0)
  const reviewTasks = data.dailyTasks.filter((task) => task.lane === 'GPA')
  const activeTasks = reviewTasks.filter((task) => !task.done)
  const doneTasks = reviewTasks.filter((task) => task.done)

  const addReviewTask = (event: FixedEvent) => {
    if (!event.subjectCode) return
    const subject = data.curriculumSubjects.find((item) => item.code === event.subjectCode)
    onUpdateTasks([
      ...data.dailyTasks,
      {
        id: crypto.randomUUID(),
        title: `Ôn thi: ${event.subjectCode}${subject ? ` - ${subject.name}` : ''}`,
        lane: 'GPA',
        subjectCode: event.subjectCode,
        done: false,
      },
    ])
  }

  const toggleTask = (taskId: string) => {
    onUpdateTasks(data.dailyTasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)))
  }

  const removeTask = (taskId: string) => {
    onUpdateTasks(data.dailyTasks.filter((task) => task.id !== taskId))
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg border border-cyan-400/20 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="success">Ôn tập tối giản</Badge>
              <Badge>{activeTasks.length} việc đang mở</Badge>
              <Badge>{doneTasks.length} đã xong</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Hôm nay ôn gì?</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">Chọn môn sắp thi, thêm việc ôn, đánh dấu xong. Không CP tracker, project hay resource làm nhiễu luồng chính.</p>
          </div>
        </div>
      </section>

      <Panel title="Ưu tiên theo lịch thi" subtitle="Môn gần ngày thi hơn đứng trước">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {exams.map((event) => {
            const subject = event.subjectCode ? data.curriculumSubjects.find((item) => item.code === event.subjectCode) : undefined
            return (
              <button key={event.id} type="button" className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-left hover:border-cyan-400/60" onClick={() => addReviewTask(event)}>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={getDaysUntil(event.date) <= 3 ? 'danger' : 'warning'}>{getDaysUntil(event.date)} ngày nữa</Badge>
                  {event.subjectCode && <Badge>{event.subjectCode}</Badge>}
                </div>
                <p className="mt-3 font-semibold text-white">{subject?.name ?? event.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{formatFixedEventTiming(event)}</p>
              </button>
            )
          })}
        </div>
      </Panel>

      <Panel title="Việc ôn tập" subtitle="Danh sách ngắn, chỉ việc cần làm">
        <div className="grid gap-3">
          {reviewTasks.map((task) => (
            <div key={task.id} className={`flex flex-wrap items-start gap-3 rounded-lg border p-4 ${task.done ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-zinc-800 bg-zinc-950'}`}>
              <button type="button" className="mt-0.5" onClick={() => toggleTask(task.id)} title={task.done ? 'Đánh dấu chưa xong' : 'Đánh dấu xong'}>
                <CheckCircle2 className={`h-5 w-5 ${task.done ? 'text-emerald-300' : 'text-zinc-500'}`} />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <Badge>{task.lane}</Badge>
                  {task.subjectCode && <button type="button" onClick={() => onOpenSubject(task.subjectCode!)}><Badge>{task.subjectCode}</Badge></button>}
                </div>
                <p className={`mt-2 font-medium ${task.done ? 'text-emerald-100 line-through decoration-emerald-300/70' : 'text-white'}`}>{task.title}</p>
              </div>
              <button type="button" className="btn-primary" onClick={() => onStartFocus({ label: task.title, lane: task.lane, subjectCode: task.subjectCode, taskId: task.id })}>Focus</button>
              <button type="button" className="icon-btn" onClick={() => removeTask(task.id)} title="Xóa"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {!reviewTasks.length && <EmptyState text="Chưa có việc ôn. Bấm một môn ở phần ưu tiên để thêm vào danh sách." />}
        </div>
      </Panel>
    </div>
  )
}

function SimpleGpaPage({ data, stats, onOpenSubject }: { data: AppData; stats: ReturnType<typeof getStats>; onOpenSubject: (subjectCode: string) => void }) {
  const completedSubjects = data.curriculumSubjects.filter((subject) => subject.completionStatus === 'completed')
  const currentSemester = data.semesterPlans[0]
  const currentSubjects = currentSemester.subjects
    .map((code) => data.curriculumSubjects.find((subject) => subject.code === code))
    .filter((subject): subject is CurriculumSubject => Boolean(subject))
  const projectedGpa = calculateProjectedSemesterGPA(currentSubjects, currentSemester.subjectPlans)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={GraduationCap} label="GPA hệ 4" value={stats.currentGPA.toFixed(2)} helper="Tích lũy hiện tại" />
        <MetricCard icon={BarChart3} label="GPA hệ 10" value={data.academicProfile.cumulativeGPA10?.toFixed(2) ?? '6.99'} helper="Theo ảnh điểm" />
        <MetricCard icon={BookOpen} label="Tín chỉ đã có điểm" value={stats.completedCredits} helper="Học kỳ 1 đã hoàn thành" />
        <MetricCard icon={Target} label="Giả lập kỳ 2" value={projectedGpa.toFixed(2)} helper="Theo target hiện tại" />
      </div>

      <Panel title="Điểm học kỳ 1" subtitle="Dữ liệu thật từ ảnh điểm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {completedSubjects.map((subject) => (
            <button key={subject.code} type="button" className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-left hover:border-cyan-400/60" onClick={() => onOpenSubject(subject.code)}>
              <div className="flex flex-wrap gap-2">
                <Badge>{subject.code}</Badge>
                <Badge>{subject.credits} TC</Badge>
                <Badge tone={subject.grade?.letter === 'A' ? 'success' : subject.grade?.letter === 'D' ? 'danger' : 'warning'}>{subject.grade?.letter}</Badge>
              </div>
              <p className="mt-3 font-semibold text-white">{subject.name}</p>
              <p className="mt-2 text-sm text-zinc-300">Tổng: {subject.grade?.score10}/10 · Hệ 4: {subject.grade?.point4}/4</p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Học kỳ 2 chưa có điểm" subtitle="Chỉ mô phỏng theo target, chưa ghi điểm thật">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {currentSubjects.map((subject) => {
            const plan = currentSemester.subjectPlans.find((item) => item.subjectCode === subject.code)
            return (
              <button key={subject.code} type="button" className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-left hover:border-cyan-400/60" onClick={() => onOpenSubject(subject.code)}>
                <div className="flex flex-wrap gap-2">
                  <Badge>{subject.code}</Badge>
                  <Badge>{subject.credits} TC</Badge>
                  <Badge>{plan?.targetGrade ?? 'B+'}</Badge>
                </div>
                <p className="mt-3 font-semibold text-white">{subject.name}</p>
                <p className="mt-2 text-sm text-zinc-400">{subject.notes}</p>
              </button>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}

function LearningPathWorkflowPage({
  data,
  stats,
  onUpdateSemesterPlans,
  onUpdateTasks,
  onSaveReview,
  onOpenSubject,
}: {
  data: AppData
  stats: ReturnType<typeof getStats>
  onUpdateSemesterPlans: (plans: SemesterPlan[]) => void
  onUpdateTasks: (tasks: DailyTask[]) => void
  onSaveReview: (review: WeeklyReview) => void
  onOpenSubject: (subjectCode: string) => void
}) {
  const [section, setSection] = useState<'overview' | 'curriculum' | 'semester' | 'risk' | 'review'>('overview')
  const sections = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'curriculum', label: 'Chương trình' },
    { id: 'semester', label: 'Học kỳ' },
    { id: 'risk', label: 'Rủi ro' },
    { id: 'review', label: 'Review' },
  ] as const

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {sections.map((item) => (
          <button key={item.id} type="button" className={`chip ${section === item.id ? 'chip-active' : ''}`} onClick={() => setSection(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      {section === 'overview' && <LearningPathOverview data={data} stats={stats} onUpdateTasks={onUpdateTasks} onOpenSubject={onOpenSubject} />}
      {section === 'curriculum' && <CurriculumRoadmap data={data} stats={stats} onUpdateTasks={onUpdateTasks} onOpenSubject={onOpenSubject} />}
      {section === 'semester' && <EditableSemesterPlanner data={data} onUpdateSemesterPlans={onUpdateSemesterPlans} onUpdateTasks={onUpdateTasks} onOpenSubject={onOpenSubject} />}
      {section === 'risk' && <LearningPathRiskPage data={data} stats={stats} onUpdateTasks={onUpdateTasks} onOpenSubject={onOpenSubject} />}
      {section === 'review' && <WeeklyReviewPage data={data} onSaveReview={onSaveReview} />}
    </div>
  )
}

function LearningPathOverview({
  data,
  stats,
  onUpdateTasks,
  onOpenSubject,
}: {
  data: AppData
  stats: ReturnType<typeof getStats>
  onUpdateTasks: (tasks: DailyTask[]) => void
  onOpenSubject: (subjectCode: string) => void
}) {
  const semesterPlan = data.semesterPlans[0]
  const semesterSubjects = semesterPlan.subjects
    .map((code) => data.curriculumSubjects.find((subject) => subject.code === code))
    .filter((subject): subject is CurriculumSubject => Boolean(subject))
  const projectedSemesterGPA = calculateProjectedSemesterGPA(semesterSubjects, semesterPlan.subjectPlans)
  const riskSubjects = data.curriculumSubjects
    .filter((subject) => ['watch', 'high', 'critical'].includes(subject.riskLevel) || subject.recoveryAction !== 'none')
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
  const selectedGroupNames = data.requirementGroups
    .filter((group) => data.academicProfile.selectedSpecializationGroupIds.includes(group.id))
    .map((group) => group.name)
  const activitySignals = getSubjectReviewSignals(data, uniqueSubjects([...semesterSubjects, ...riskSubjects]))

  const addSubjectTask = (subject: CurriculumSubject) => {
    onUpdateTasks(addUniqueDailyTask(data.dailyTasks, {
      title: `Lộ trình: xử lý ${subject.code} - ${subject.name}`,
      lane: subject.tags.includes('CP') ? 'CP' : subject.tags.includes('SE') || subject.tags.includes('CS') ? 'CS_SE' : 'GPA',
      subjectCode: subject.code,
      source: 'roadmap',
      dueDate: today,
    }))
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg border border-cyan-400/20 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="success">Lộ trình học tập</Badge>
              <Badge>{semesterPlan.academicYear}</Badge>
              <Badge>{selectedGroupNames[0] ?? 'Chưa chọn chuyên ngành'}</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Toàn cảnh chương trình học</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">Theo dõi tiến độ tốt nghiệp, học kỳ hiện tại, môn rủi ro và các điều chỉnh dài hạn ở một nơi.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={BookOpen} label="Tiến độ tốt nghiệp" value={`${stats.completedCredits}/${data.academicProfile.minimumRequiredCredits}`} helper={`${stats.creditProgress.percent}% tối thiểu`} />
        <MetricCard icon={GraduationCap} label="GPA hiện tại" value={stats.currentGPA.toFixed(2)} helper={`Hệ 10: ${data.academicProfile.cumulativeGPA10?.toFixed(2) ?? '6.99'}`} />
        <MetricCard icon={Target} label="Dự phóng kỳ này" value={projectedSemesterGPA.toFixed(2)} helper={`target ${semesterPlan.targetSemesterGPA4.toFixed(2)}`} />
        <MetricCard icon={AlertTriangle} label="Môn cần chú ý" value={riskSubjects.length} helper="risk/recovery/action" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Học kỳ hiện tại" subtitle="5 môn đang học và target của từng môn">
          <div className="grid gap-3">
            {semesterSubjects.map((subject) => {
              const plan = semesterPlan.subjectPlans.find((item) => item.subjectCode === subject.code)
              return (
                <button key={subject.code} type="button" className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-left hover:border-cyan-400/60" onClick={() => onOpenSubject(subject.code)}>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{subject.code}</Badge>
                    <Badge>{subject.credits} TC</Badge>
                    <Badge>{plan?.targetGrade ?? 'B+'}</Badge>
                    <Badge tone={riskTone(subject.riskLevel)}>{subject.riskLevel}</Badge>
                  </div>
                  <p className="mt-2 font-semibold text-white">{subject.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{plan?.weeklyHours ?? 0} giờ/tuần · {plan?.status ?? 'not_started'}</p>
                </button>
              )
            })}
          </div>
        </Panel>

        <Panel title="Rủi ro ưu tiên" subtitle="Bấm để đưa vào task hôm nay">
          <div className="grid gap-3">
            {riskSubjects.slice(0, 5).map((subject) => (
              <button key={subject.code} type="button" className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-left hover:border-amber-300" onClick={() => addSubjectTask(subject)}>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={riskTone(subject.riskLevel)}>{subject.riskLevel}</Badge>
                  <Badge>{subject.code}</Badge>
                  <Badge>{subject.recoveryAction}</Badge>
                </div>
                <p className="mt-2 font-medium text-white">{subject.name}</p>
                {subject.notes && <p className="mt-1 text-sm text-amber-100">{subject.notes}</p>}
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Tín hiệu ôn tập từ Daily Review" subtitle="Môn nào được đụng tới gần đây và môn nào đang bị bỏ quên">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-white">Đã ôn gần đây</p>
              <Badge tone="success">{activitySignals.recent.length} môn</Badge>
            </div>
            <div className="mt-3 grid gap-2">
              {activitySignals.recent.map((item) => (
                <button key={item.code} type="button" className="rounded-md border border-emerald-400/20 bg-zinc-950 px-3 py-2 text-left hover:border-emerald-300" onClick={() => onOpenSubject(item.code)}>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="success">{item.code}</Badge>
                    <Badge>{formatShortDate(item.lastDate)}</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm text-zinc-300">{item.name}</p>
                </button>
              ))}
              {!activitySignals.recent.length && <p className="text-sm text-zinc-500">Chưa có Daily Review nào ghi môn đã học.</p>}
            </div>
          </div>
          <div className="rounded-lg border border-amber-400/25 bg-amber-400/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-white">Bị bỏ quên</p>
              <Badge tone="warning">{activitySignals.forgotten.length} môn</Badge>
            </div>
            <div className="mt-3 grid gap-2">
              {activitySignals.forgotten.map((subject) => (
                <button key={subject.code} type="button" className="rounded-md border border-amber-400/20 bg-zinc-950 px-3 py-2 text-left hover:border-amber-300" onClick={() => addSubjectTask(subject)}>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={riskTone(subject.riskLevel)}>{subject.code}</Badge>
                    <Badge>{subject.riskLevel}</Badge>
                    <Badge>{subject.credits} TC</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm text-zinc-300">{subject.name}</p>
                </button>
              ))}
              {!activitySignals.forgotten.length && <p className="text-sm text-zinc-500">Các môn ưu tiên đều có tín hiệu ôn gần đây.</p>}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}

function LearningPathRiskPage({
  data,
  stats,
  onUpdateTasks,
  onOpenSubject,
}: {
  data: AppData
  stats: ReturnType<typeof getStats>
  onUpdateTasks: (tasks: DailyTask[]) => void
  onOpenSubject: (subjectCode: string) => void
}) {
  const recoverySubjects = data.curriculumSubjects
    .filter((subject) => ['critical', 'high', 'watch'].includes(subject.riskLevel) || subject.recoveryAction !== 'none')
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))

  const addSubjectTask = (subject: CurriculumSubject) => {
    onUpdateTasks(addUniqueDailyTask(data.dailyTasks, {
      title: `Rủi ro: ${subject.code} - ${subject.name}`,
      lane: subject.tags.includes('CP') ? 'CP' : subject.tags.includes('SE') || subject.tags.includes('CS') ? 'CS_SE' : 'GPA',
      subjectCode: subject.code,
      source: 'roadmap',
      dueDate: today,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={GraduationCap} label="GPA hiện tại" value={stats.currentGPA.toFixed(2)} helper="tích lũy hệ 4" />
        <MetricCard icon={AlertTriangle} label="Môn rủi ro" value={recoverySubjects.length} helper="watch/high/critical" />
        <MetricCard icon={BarChart3} label="Tín chỉ đã có điểm" value={stats.completedCredits} helper="Học kỳ 1 đã hoàn thành" />
        <MetricCard icon={Target} label="Target ngắn hạn" value={data.academicProfile.targetShortTermGPA4.toFixed(2)} helper="GPA tích lũy" />
      </div>

      <Panel title="Bảng rủi ro học tập" subtitle="Môn kéo GPA hoặc nền tảng xuống, có thể biến thành task hôm nay">
        <div className="grid gap-4 lg:grid-cols-3">
          {recoverySubjects.map((subject) => (
            <article key={subject.code} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone={riskTone(subject.riskLevel)}>{subject.riskLevel}</Badge>
                <Badge>{subject.recoveryAction}</Badge>
                <Badge>{subject.code}</Badge>
              </div>
              <button type="button" className="mt-3 text-left font-semibold text-white hover:text-cyan-200" onClick={() => onOpenSubject(subject.code)}>
                {subject.name}
              </button>
              {subject.grade && <p className="mt-2 text-sm text-zinc-300">Điểm: {subject.grade.score10}/10 · {subject.grade.letter} · {subject.grade.point4}/4</p>}
              {subject.notes && <p className="mt-2 text-sm text-zinc-400">{subject.notes}</p>}
              <button type="button" className="btn-primary mt-4" onClick={() => addSubjectTask(subject)}>
                <Plus className="h-4 w-4" />
                Đưa vào hôm nay
              </button>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function CurriculumRoadmap({ data, stats, onUpdateTasks, onOpenSubject }: { data: AppData; stats: ReturnType<typeof getStats>; onUpdateTasks: (tasks: DailyTask[]) => void; onOpenSubject: (subjectCode: string) => void }) {
  const [semester, setSemester] = useState('all')
  const [groupId, setGroupId] = useState('all')
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | 'all'>('all')
  const [riskLevel, setRiskLevel] = useState<RiskLevel | 'all'>('all')
  const [importance, setImportance] = useState<ImportanceLevel | 'all'>('all')
  const [tag, setTag] = useState<SubjectTag | 'all'>('all')
  const [requiredOnly, setRequiredOnly] = useState('all')

  const filteredSubjects = data.curriculumSubjects
    .filter((subject) => semester === 'all' || String(subject.expectedSemester) === semester)
    .filter((subject) => groupId === 'all' || subject.groupId === groupId)
    .filter((subject) => completionStatus === 'all' || subject.completionStatus === completionStatus)
    .filter((subject) => riskLevel === 'all' || subject.riskLevel === riskLevel)
    .filter((subject) => importance === 'all' || subject.importance === importance)
    .filter((subject) => tag === 'all' || subject.tags.includes(tag))
    .filter((subject) => requiredOnly === 'all' || (requiredOnly === 'required' ? subject.required : !subject.required))
    .sort((a, b) => a.expectedSemester - b.expectedSemester || getPriorityScore(b) - getPriorityScore(a))

  const selectedGroupNames = data.requirementGroups
    .filter((group) => data.academicProfile.selectedSpecializationGroupIds.includes(group.id))
    .map((group) => group.name)
    .join(', ')

  const addSubjectTask = (subject: CurriculumSubject) => {
    onUpdateTasks(addUniqueDailyTask(data.dailyTasks, {
      title: `Lộ trình: ${subject.code} - ${subject.name}`,
      lane: subject.tags.includes('CP') ? 'CP' : subject.tags.includes('SE') || subject.tags.includes('CS') ? 'CS_SE' : 'GPA',
      subjectCode: subject.code,
      source: 'roadmap',
      dueDate: today,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={BarChart3} label="Tín chỉ đã đạt" value={stats.creditProgress.completedCredits} helper={`Tối thiểu ${stats.creditProgress.minimumRequiredCredits}`} />
        <MetricCard icon={Target} label="Còn lại" value={stats.creditProgress.remainingCredits} helper="tín chỉ tới mốc tối thiểu" />
        <MetricCard icon={GraduationCap} label="GPA hiện tại" value={stats.currentGPA.toFixed(2)} helper="tính từ các môn đã có điểm" />
        <MetricCard icon={Map} label="Tiến độ lộ trình" value={`${stats.creditProgress.percent}%`} helper="theo 122 tín chỉ tối thiểu" />
      </div>

      <Panel title="Định hướng chuyên ngành" subtitle="Đang tập trung vào Khoa học máy tính">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm text-zinc-400">Nhóm chuyên ngành đang chọn</p>
            <p className="mt-1 font-semibold text-white">{selectedGroupNames || 'Chưa chọn chuyên ngành'}</p>
            <p className="mt-3 text-sm text-zinc-300">Các môn chuyên ngành khác đã được ẩn khỏi seed để lộ trình tập trung vào Khoa học máy tính.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.requirementGroups.filter((group) => group.isSpecializationOption).map((group) => (
              <div key={group.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <Badge tone={data.academicProfile.selectedSpecializationGroupIds.includes(group.id) ? 'success' : 'default'}>
                  {data.academicProfile.selectedSpecializationGroupIds.includes(group.id) ? 'Đang chọn' : 'Chưa chọn'}
                </Badge>
                <p className="mt-2 text-sm font-medium text-white">{group.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{data.academicProfile.selectedSpecializationGroupIds.includes(group.id) ? 'Được tính vào tiến độ chuyên ngành' : 'Không tính vào lộ trình chính'}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="Tiến độ theo khối kiến thức" subtitle="Tính theo các môn trong chương trình đào tạo CS">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {data.requirementGroups.map((group) => {
            const progress = calculateGroupProgress(group, data.curriculumSubjects, data.academicProfile.selectedSpecializationGroupIds)
            return (
              <div key={group.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-white">{group.name}</p>
                  <Badge tone={progress.isCounted ? 'success' : 'default'}>{progress.isCounted ? 'tính' : 'tùy chọn'}</Badge>
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{progress.completedCredits}/{progress.requiredCredits}</p>
                <Progress value={progress.percent} />
                {!progress.isCounted && <p className="mt-2 text-xs text-zinc-500">Chưa chọn nên không tính vào lộ trình chính.</p>}
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel title="Semester Timeline" subtitle="Học kỳ 1 đến học kỳ 8">
        <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
          {Array.from({ length: 8 }, (_, index) => {
            const term = index + 1
            const subjects = data.curriculumSubjects.filter((subject) => subject.expectedSemester === term)
            const credits = subjects.reduce((sum, subject) => sum + subject.credits, 0)
            const critical = subjects.filter((subject) => subject.importance === 'critical').length
            const state = term === 1 ? 'Đã học' : term === 2 ? 'Đang học' : 'Chưa học'
            return (
              <button key={term} type="button" className={`rounded-lg border p-4 text-left ${semester === String(term) ? 'border-cyan-400 bg-cyan-400/10' : 'border-zinc-800 bg-zinc-950'}`} onClick={() => setSemester(String(term))}>
                <p className="text-sm text-zinc-400">Học kỳ {term}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{credits} TC</p>
                <p className="mt-1 text-xs text-zinc-500">{subjects.length} môn · {critical} critical</p>
                <Badge tone={state === 'Đang học' ? 'warning' : state === 'Đã học' ? 'success' : 'default'}>{state}</Badge>
              </button>
            )
          })}
        </div>
      </Panel>

      <Panel title="Bộ lọc môn học" subtitle="Lọc theo học kỳ, khối kiến thức, trạng thái, rủi ro và tag">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-7">
          <Select label="Học kỳ" value={semester} onChange={setSemester} options={['all', '1', '2', '3', '4', '5', '6', '7', '8']} />
          <Select label="Khối" value={groupId} onChange={setGroupId} options={['all', ...data.requirementGroups.map((group) => group.id)]} />
          <Select label="Trạng thái" value={completionStatus} onChange={(value) => setCompletionStatus(value as CompletionStatus | 'all')} options={completionStatuses} />
          <Select label="Rủi ro" value={riskLevel} onChange={(value) => setRiskLevel(value as RiskLevel | 'all')} options={riskLevels} />
          <Select label="Độ quan trọng" value={importance} onChange={(value) => setImportance(value as ImportanceLevel | 'all')} options={importanceLevels} />
          <Select label="Tag" value={tag} onChange={(value) => setTag(value as SubjectTag | 'all')} options={['all', ...subjectTags]} />
          <Select label="Bắt buộc" value={requiredOnly} onChange={setRequiredOnly} options={['all', 'required', 'elective']} />
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredSubjects.map((subject) => (
          <SubjectCard key={subject.code} subject={subject} groupName={getGroupName(subject.groupId, data.requirementGroups)} onOpenSubject={onOpenSubject} onAddTask={addSubjectTask} />
        ))}
      </div>
    </div>
  )
}

function GpaRecoveryMap({ data, stats, onOpenSubject }: { data: AppData; stats: ReturnType<typeof getStats>; onOpenSubject: (subjectCode: string) => void }) {
  const profile = data.academicProfile
  const recoverySubjects = data.curriculumSubjects.filter((subject) => ['critical', 'high'].includes(subject.riskLevel) || subject.recoveryAction !== 'none')

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={GraduationCap} label="Current GPA" value={stats.currentGPA.toFixed(2)} helper="Recovery Phase" />
        <MetricCard icon={BarChart3} label="Completed Credits" value={stats.completedCredits} helper={`of ${profile.minimumRequiredCredits}`} />
        <MetricCard icon={AlertTriangle} label="Recovery Subjects" value={recoverySubjects.length} helper="high/critical/action needed" />
        <MetricCard icon={Target} label="Semester 2 Target" value=">= 3.20" helper="no subject below B" />
      </div>

      <Panel title="Required Future GPA" subtitle="Tính theo 122 tín chỉ tối thiểu tốt nghiệp">
        <div className="grid gap-4 md:grid-cols-3">
          {[profile.targetShortTermGPA4, profile.targetScholarshipGPA4, profile.targetExcellentGPA4].map((target) => (
            <div key={target} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-sm text-zinc-400">To reach {target.toFixed(2)} overall</p>
              <p className="mt-2 text-3xl font-semibold text-white">{requiredFutureGPA(target, stats.currentGPA, stats.completedCredits, profile.minimumRequiredCredits).toFixed(2)}</p>
              <p className="mt-1 text-sm text-zinc-500">average for remaining credits</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Recovery Subjects" subtitle="Môn đã kéo GPA hoặc nền tảng xuống">
        <div className="grid gap-4 lg:grid-cols-3">
          {recoverySubjects.map((subject) => (
            <div key={subject.code} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone={subject.riskLevel === 'critical' ? 'danger' : 'warning'}>{subject.riskLevel}</Badge>
                <Badge>{subject.recoveryAction}</Badge>
              </div>
              <button type="button" className="mt-3 text-left font-semibold text-white hover:text-cyan-200" onClick={() => onOpenSubject(subject.code)}>{subject.code} · {subject.name}</button>
              <p className="mt-2 text-sm text-zinc-400">{subject.notes}</p>
              {subject.grade && <p className="mt-3 text-sm text-zinc-300">Grade: {subject.grade.letter} · point4 {subject.grade.point4?.toFixed(1)}</p>}
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="30-Day Recovery Plan" subtitle="Daily minimum while MVP is being used">
          <ul className="space-y-3 text-sm text-zinc-300">
            <li>45 phút Toán/Đại số tuyến tính/Cơ sở toán recovery.</li>
            <li>60 phút C++/Lập trình nâng cao/Kỹ thuật lập trình.</li>
            <li>45 phút Frontend hoặc Database practice.</li>
            <li>1-2 bài CP dễ hoặc 1 upsolve nhỏ mỗi ngày.</li>
          </ul>
        </Panel>

        <Panel title="Semester 2 Target" subtitle="Kỳ quyết định phục hồi">
          <div className="grid gap-3 md:grid-cols-2">
            {['Goal: semester GPA >= 3.20', 'Rule: no subject below B', 'Stretch: at least 2 subjects at A', 'Critical: TIN3083, TIN1083, TIN3183, TOA1023'].map((item) => (
              <div key={item} className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm text-cyan-100">{item}</div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function SemesterPlanner({ data }: { data: AppData }) {
  const plan = data.semesterPlans[0]
  const subjects = plan.subjects
    .map((code) => data.curriculumSubjects.find((subject) => subject.code === code))
    .filter((subject): subject is CurriculumSubject => Boolean(subject))
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Target} label="Semester Target" value={`>= ${plan.targetSemesterGPA4.toFixed(2)}`} helper="GPA kỳ 2" />
        <MetricCard icon={BookOpen} label="Subjects" value={subjects.length} helper={plan.academicYear} />
        <MetricCard icon={BarChart3} label="Credits" value={subjects.reduce((sum, subject) => sum + subject.credits, 0)} helper={`max recommended ${plan.maxCreditsRecommended}`} />
        <MetricCard icon={AlertTriangle} label="Mode" value="Recovery" helper="protect GPA and foundations" />
      </div>

      <Panel title="Semester 2 Strategy" subtitle="Học kỳ 2 là kỳ quyết định phục hồi">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {plan.weeklyRules.map((rule) => (
            <div key={rule} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300">{rule}</div>
          ))}
        </div>
      </Panel>

      <Panel title="Subject Priority" subtitle="Priority score = importance + risk + credits + recovery action">
        <div className="grid gap-4 xl:grid-cols-2">
          {subjects.map((subject) => (
            <SubjectCard key={subject.code} subject={subject} groupName={getGroupName(subject.groupId, data.requirementGroups)} />
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Weekly Schedule Template" subtitle="Lặp lại mỗi tuần, điều chỉnh theo deadline">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['Monday', 'Review lecture notes 30 phút + C++ practice 60 phút'],
              ['Tuesday', 'Database practice 60 phút + Math exercises 45 phút'],
              ['Wednesday', 'Programming assignment 90 phút'],
              ['Thursday', 'CP: 2 easy problems + review weak topics'],
              ['Friday', 'Frontend recovery/project 60 phút'],
              ['Saturday', 'Deep work block 2-3 giờ + finish assignments'],
              ['Sunday', 'Weekly Review + update GPA Tracker + plan next week'],
            ].map(([day, work]) => (
              <div key={day} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <p className="font-semibold text-white">{day}</p>
                <p className="mt-2 text-sm text-zinc-300">{work}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Weekly Review Questions" subtitle="Dùng ở trang Weekly Review">
          <ol className="space-y-3 text-sm text-zinc-300">
            <li>1. Môn nào tuần này nguy hiểm nhất?</li>
            <li>2. Có assignment nào chưa xong không?</li>
            <li>3. Mình có học dồn không?</li>
            <li>4. CP có upsolve không?</li>
            <li>5. Môn nào cần tăng thời lượng tuần sau?</li>
          </ol>
        </Panel>
      </div>
    </div>
  )
}

void SemesterPlanner

function EditableSemesterPlanner({
  data,
  onUpdateSemesterPlans,
  onUpdateTasks,
  onOpenSubject,
}: {
  data: AppData
  onUpdateSemesterPlans: (plans: SemesterPlan[]) => void
  onUpdateTasks: (tasks: DailyTask[]) => void
  onOpenSubject: (subjectCode: string) => void
}) {
  const plan = data.semesterPlans[0]
  const subjects = plan.subjects
    .map((code) => data.curriculumSubjects.find((subject) => subject.code === code))
    .filter((subject): subject is CurriculumSubject => Boolean(subject))
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0)
  const weeklyHours = plan.subjectPlans.reduce((sum, item) => sum + item.weeklyHours, 0)
  const projectedGPA = calculateProjectedSemesterGPA(subjects, plan.subjectPlans)
  const safeSubjects = plan.subjectPlans.filter((item) => item.status === 'safe').length
  const dangerSubjects = subjects.filter((subject) => ['watch', 'high', 'critical'].includes(subject.riskLevel))

  const updatePlan = (patch: Partial<SemesterPlan>) => {
    onUpdateSemesterPlans(data.semesterPlans.map((item, index) => (index === 0 ? { ...item, ...patch } : item)))
  }

  const updateSubjectPlan = (subjectCode: string, patch: Partial<SemesterSubjectPlan>) => {
    updatePlan({
      subjectPlans: plan.subjectPlans.map((item) => (item.subjectCode === subjectCode ? { ...item, ...patch } : item)),
    })
  }

  const addSubjectTask = (subject: CurriculumSubject) => {
    onUpdateTasks([
      ...data.dailyTasks,
      {
        id: crypto.randomUUID(),
        title: `Semester: study ${subject.code} - ${subject.name}`,
        lane: subject.tags.includes('CP') ? 'CP' : subject.tags.includes('SE') || subject.tags.includes('CS') ? 'CS_SE' : 'GPA',
        subjectCode: subject.code,
        done: false,
      },
    ])
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Target} label="Target học kỳ" value={`>= ${plan.targetSemesterGPA4.toFixed(2)}`} helper={`dự phóng ${projectedGPA.toFixed(2)}`} />
        <MetricCard icon={BookOpen} label="Số môn" value={subjects.length} helper={plan.academicYear} />
        <MetricCard icon={BarChart3} label="Tín chỉ" value={totalCredits} helper={`khuyến nghị tối đa ${plan.maxCreditsRecommended}`} />
        <MetricCard icon={AlertTriangle} label="Môn an toàn" value={`${safeSubjects}/${subjects.length}`} helper={`${weeklyHours} giờ/tuần`} />
      </div>

      <Panel title="Thiết lập học kỳ" subtitle="Target được lưu vào localStorage">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Target GPA học kỳ" type="number" value={String(plan.targetSemesterGPA4)} onChange={(value) => updatePlan({ targetSemesterGPA4: clampNumber(Number(value), 0, 4) })} />
          <Input label="Tín chỉ khuyến nghị" type="number" value={String(plan.maxCreditsRecommended)} onChange={(value) => updatePlan({ maxCreditsRecommended: Math.max(0, Math.round(Number(value) || 0)) })} />
          <Input label="Năm học" value={plan.academicYear} onChange={(academicYear) => updatePlan({ academicYear })} />
        </div>
      </Panel>

      <Panel title="Kế hoạch từng môn" subtitle="Chỉnh target điểm, trạng thái và số giờ học mỗi tuần">
        <div className="grid gap-4">
          {subjects.map((subject) => (
            <SemesterSubjectRow
              key={subject.code}
              subject={subject}
              subjectPlan={plan.subjectPlans.find((item) => item.subjectCode === subject.code) ?? createDefaultSemesterSubjectPlan(subject.code)}
              groupName={getGroupName(subject.groupId, data.requirementGroups)}
              onUpdate={updateSubjectPlan}
              onAddTask={addSubjectTask}
              onOpenSubject={onOpenSubject}
            />
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Khung học tuần" subtitle="Lặp lại mỗi tuần và chỉnh quanh lịch thi/deadline">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['Monday', 'Review lecture notes 30 minutes + C++ practice 60 minutes'],
              ['Tuesday', 'Database practice 60 minutes + math exercises 45 minutes'],
              ['Wednesday', 'Programming assignment 90 minutes'],
              ['Thursday', 'CP: 2 easy problems + review weak topics'],
              ['Friday', 'Frontend recovery or project 60 minutes'],
              ['Saturday', 'Deep work block 2-3 hours + finish assignments'],
              ['Sunday', 'Weekly Review + update semester plan'],
            ].map(([day, work]) => (
              <div key={day} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <p className="font-semibold text-white">{day}</p>
                <p className="mt-2 text-sm text-zinc-300">{work}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Hàng đợi rủi ro" subtitle="Môn nên xử lý trước buổi review tuần">
          <div className="grid gap-3">
            {dangerSubjects.map((subject) => (
              <button key={subject.code} type="button" className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-left hover:border-amber-300" onClick={() => addSubjectTask(subject)}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={riskTone(subject.riskLevel)}>{subject.riskLevel}</Badge>
                  <Badge tone={importanceTone(subject.importance)}>{subject.importance}</Badge>
                  <Badge>{subject.code}</Badge>
                </div>
                <p className="mt-2 font-medium text-white">{subject.name}</p>
                <p className="mt-1 text-sm text-amber-100">{subject.notes}</p>
              </button>
            ))}
            {!dangerSubjects.length && <EmptyState text="No current semester risk subjects." />}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function SemesterSubjectRow({
  subject,
  subjectPlan,
  groupName,
  onUpdate,
  onAddTask,
  onOpenSubject,
}: {
  subject: CurriculumSubject
  subjectPlan: SemesterSubjectPlan
  groupName: string
  onUpdate: (subjectCode: string, patch: Partial<SemesterSubjectPlan>) => void
  onAddTask: (subject: CurriculumSubject) => void
  onOpenSubject: (subjectCode: string) => void
}) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{subject.code}</Badge>
            <Badge>{subject.credits} TC</Badge>
            <Badge tone={riskTone(subject.riskLevel)}>{subject.riskLevel}</Badge>
            <Badge tone={importanceTone(subject.importance)}>{subject.importance}</Badge>
          </div>
          <button type="button" className="mt-2 text-left font-semibold text-white hover:text-cyan-200" onClick={() => onOpenSubject(subject.code)}>{subject.name}</button>
          <p className="mt-1 text-sm text-zinc-500">{groupName}</p>
          {subject.notes && <p className="mt-2 text-sm text-zinc-300">{subject.notes}</p>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Target" value={subjectPlan.targetGrade} onChange={(value) => onUpdate(subject.code, { targetGrade: value as SemesterSubjectPlan['targetGrade'] })} options={semesterTargetGrades} />
          <Select label="Trạng thái" value={subjectPlan.status} onChange={(value) => onUpdate(subject.code, { status: value as SemesterSubjectPlan['status'] })} options={semesterSubjectStatuses} />
          <Input label="Giờ/tuần" type="number" value={String(subjectPlan.weeklyHours)} onChange={(value) => onUpdate(subject.code, { weeklyHours: Math.max(0, Math.round(Number(value) || 0)) })} />
          <div className="flex items-end">
            <button type="button" className="btn-primary w-full justify-center" onClick={() => onAddTask(subject)}>
              <Plus className="h-4 w-4" />
              Hôm nay
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function createDefaultSemesterSubjectPlan(subjectCode: string): SemesterSubjectPlan {
  return { subjectCode, targetGrade: 'B+', status: 'not_started', weeklyHours: 3 }
}

function WeeklyPlanPage({
  data,
  onUpdateFixedEvents,
  onUpdateStudyBlocks,
  onUpdateTasks,
  onStartFocus,
  onOpenSubject,
}: {
  data: AppData
  onUpdateFixedEvents: (events: FixedEvent[]) => void
  onUpdateStudyBlocks: (blocks: WeeklyStudyBlock[]) => void
  onUpdateTasks: (tasks: DailyTask[]) => void
  onStartFocus: (target: FocusTarget) => void
  onOpenSubject: (subjectCode: string) => void
}) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<FixedEvent['type']>('class')
  const [dayOfWeek, setDayOfWeek] = useState<FixedEvent['dayOfWeek']>(1)
  const [startTime, setStartTime] = useState('07:30')
  const [endTime, setEndTime] = useState('09:00')
  const [subjectCode, setSubjectCode] = useState('')
  const [viewMode, setViewMode] = useState<'board' | 'today' | 'list'>('board')
  const priorityQueue = getGpaPriorityQueue(data)
  const now = new Date()
  const todayDay = getIsoDay(now)
  const todayFixedEvents = data.weeklyFixedEvents.filter((event) => isEventOnDate(event, now)).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
  const todayBlocks = data.weeklyStudyBlocks.filter((block) => block.dayOfWeek === todayDay).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
  const nextBlock = todayBlocks.filter((block) => !block.done)[0]
  const sortedWeekBlocks = [...data.weeklyStudyBlocks].sort((a, b) => a.dayOfWeek - b.dayOfWeek || timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
  const weeklyPlannedMinutes = data.weeklyStudyBlocks.reduce((sum, block) => sum + Math.max(0, timeToMinutes(block.endTime) - timeToMinutes(block.startTime)), 0)
  const weeklyDoneMinutes = data.weeklyStudyBlocks.filter((block) => block.done).reduce((sum, block) => sum + Math.max(0, timeToMinutes(block.endTime) - timeToMinutes(block.startTime)), 0)
  const subjectHourGaps = getWeeklySubjectHourGaps(data)

  const addFixedEvent = () => {
    const cleanedTitle = title.trim()
    if (!cleanedTitle) return
    onUpdateFixedEvents([
      ...data.weeklyFixedEvents,
      { id: crypto.randomUUID(), title: cleanedTitle, type, dayOfWeek, startTime, endTime, subjectCode: subjectCode || undefined },
    ])
    setTitle('')
    setSubjectCode('')
  }

  const removeFixedEvent = (eventId: string) => {
    onUpdateFixedEvents(data.weeklyFixedEvents.filter((event) => event.id !== eventId))
  }

  const generatePlan = () => {
    onUpdateStudyBlocks(generateWeeklyStudyBlocks(data))
  }

  const addBlockTask = (block: WeeklyStudyBlock) => {
    const subject = data.curriculumSubjects.find((item) => item.code === block.subjectCode)
    const task: DailyTask = {
      id: crypto.randomUUID(),
      title: `Weekly Plan: ${block.subjectCode}${subject ? ` - ${subject.name}` : ''}`,
      lane: block.lane,
      subjectCode: block.subjectCode,
      weeklyBlockId: block.id,
      source: 'roadmap',
      dueDate: today,
      done: false,
    }
    onUpdateTasks([...data.dailyTasks, task])
    onUpdateStudyBlocks(data.weeklyStudyBlocks.map((item) => (item.id === block.id ? { ...item, taskId: task.id } : item)))
  }

  const updateBlock = (blockId: string, patch: Partial<WeeklyStudyBlock>) => {
    onUpdateStudyBlocks(data.weeklyStudyBlocks.map((block) => (block.id === blockId ? { ...block, ...patch } : block)))
  }

  const removeBlock = (blockId: string) => {
    onUpdateStudyBlocks(data.weeklyStudyBlocks.filter((block) => block.id !== blockId))
  }

  const renderFixedEvent = (event: FixedEvent) => (
    <div key={event.id} className="interactive-card rounded-lg border border-zinc-700 bg-zinc-950 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge>{event.type}</Badge>
            {event.subjectCode && <Badge>{event.subjectCode}</Badge>}
          </div>
          <p className="mt-2 text-sm font-semibold text-white">{formatFixedEventTiming(event)}</p>
          <p className="truncate text-sm text-zinc-300">{event.title}</p>
          {event.note && <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{event.note}</p>}
          {event.subjectCode && <button type="button" className="mt-1 text-xs text-cyan-200" onClick={() => onOpenSubject(event.subjectCode!)}>Open subject</button>}
        </div>
        <button type="button" className="icon-btn shrink-0" onClick={() => removeFixedEvent(event.id)} title="Delete event"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  )

  const renderStudyBlock = (block: WeeklyStudyBlock, compact = false) => (
    <div key={block.id} className={`interactive-card rounded-lg border p-3 ${block.done ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-cyan-400/40 bg-cyan-400/10'}`}>
      <div className="flex flex-wrap gap-2">
        <Badge>{compact ? getWeekDayLabel(block.dayOfWeek) : `${block.startTime}-${block.endTime}`}</Badge>
        {compact && <Badge>{block.startTime}-{block.endTime}</Badge>}
        <Badge>{block.subjectCode}</Badge>
        <Badge>{block.done ? 'done' : block.lane}</Badge>
      </div>
      <p className="mt-2 text-sm font-medium text-zinc-100">{block.reason}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" className="btn-primary justify-center" onClick={() => onStartFocus({ label: `Weekly Plan: ${block.subjectCode}`, lane: block.lane, subjectCode: block.subjectCode, studyBlockId: block.id })}>Focus</button>
        <button type="button" className="chip justify-center" onClick={() => addBlockTask(block)}>Daily</button>
        <button type="button" className="chip justify-center" onClick={() => onOpenSubject(block.subjectCode)}>Subject</button>
        <button type="button" className="chip justify-center" onClick={() => updateBlock(block.id, { done: !block.done })}>{block.done ? 'Undo' : 'Done'}</button>
        <button type="button" className="icon-btn col-span-2 justify-self-end" onClick={() => removeBlock(block.id)} title="Delete block"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg border border-cyan-400/20 p-5">
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="success">GPA first</Badge>
              <Badge>{todayFixedEvents.length} fixed today</Badge>
              <Badge>{todayBlocks.filter((block) => !block.done).length} study blocks</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Operate today from one flow</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">Check fixed schedule, pick the next GPA block, convert it to a daily task, then run the shared Pomodoro timer.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {['Schedule', 'Daily task', 'Focus timer'].map((item, index) => (
              <div key={item} className="surface-card rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-cyan-400 text-sm font-bold text-zinc-950">{index + 1}</span>
                  <p className="font-semibold text-white">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={CalendarCheck} label="Fixed Events" value={data.weeklyFixedEvents.length} helper="school, work, exam, deadline" />
        <MetricCard icon={Target} label="Study Blocks" value={data.weeklyStudyBlocks.length} helper={`${data.weeklyStudyBlocks.filter((block) => block.done).length} done`} />
        <MetricCard icon={AlertTriangle} label="GPA Queue" value={priorityQueue.length} helper="risk-based priority" />
        <MetricCard icon={CheckCircle2} label="Planned Minutes" value={`${Math.round(weeklyDoneMinutes / 60)}h/${Math.round(weeklyPlannedMinutes / 60)}h`} helper={nextBlock ? `next ${nextBlock.startTime} ${nextBlock.subjectCode}` : 'no block'} />
      </div>

      <Panel title="Add Fixed Schedule" subtitle="Class, work, exam, deadline, or personal commitment">
        <div className="grid gap-4 xl:grid-cols-[1fr_130px_130px_120px_120px_180px_auto]">
          <Input label="Title" value={title} onChange={setTitle} />
          <Select label="Type" value={type} onChange={(value) => setType(value as FixedEvent['type'])} options={fixedEventTypes} />
          <Select label="Day" value={String(dayOfWeek)} onChange={(value) => setDayOfWeek(Number(value) as FixedEvent['dayOfWeek'])} options={weekDays.map((day) => String(day.value))} />
          <Input label="Start" value={startTime} onChange={setStartTime} />
          <Input label="End" value={endTime} onChange={setEndTime} />
          <Select label="Subject" value={subjectCode} onChange={setSubjectCode} options={['', ...data.curriculumSubjects.map((subject) => subject.code)]} />
          <div className="flex items-end">
            <button type="button" className="btn-primary w-full justify-center" onClick={addFixedEvent}>
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </Panel>

      <Panel title="Generate GPA-first Plan" subtitle="Avoids fixed events, late slots, overloaded days, and prioritizes GPA risk">
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={generatePlan}>
            <RotateCcw className="h-4 w-4" />
            Generate Smart Plan
          </button>
          <button type="button" className="chip" onClick={() => onUpdateStudyBlocks([])}>Clear study blocks</button>
          {(['board', 'today', 'list'] as const).map((mode) => (
            <button key={mode} type="button" className={`chip ${viewMode === mode ? 'chip-active' : ''}`} onClick={() => setViewMode(mode)}>
              {mode === 'board' ? 'Week Board' : mode === 'today' ? 'Today Focus' : 'Compact List'}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {priorityQueue.slice(0, 8).map((item) => (
            <button key={item.subject.code} type="button" className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-left hover:border-cyan-400/60" onClick={() => onOpenSubject(item.subject.code)}>
              <div className="flex flex-wrap gap-2">
                <Badge>{item.score}</Badge>
                <Badge tone={riskTone(item.subject.riskLevel)}>{item.subject.riskLevel}</Badge>
                <Badge>{item.subject.code}</Badge>
              </div>
              <p className="mt-2 text-sm font-semibold text-white">{item.subject.name}</p>
              <p className="mt-1 text-xs text-zinc-500">{item.reason}</p>
            </button>
          ))}
        </div>
        {!!subjectHourGaps.length && (
          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/80 p-3">
            <p className="text-sm font-semibold text-white">Subjects still short on weekly hours</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {subjectHourGaps.slice(0, 8).map((item) => (
                <Badge key={item.subjectCode} tone={item.missingMinutes >= 120 ? 'warning' : 'default'}>
                  {item.subjectCode}: -{Math.ceil(item.missingMinutes / 60)}h
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Panel>

      {viewMode === 'today' && (
        <Panel title="Today Focus" subtitle="Only today's fixed schedule and remaining study blocks">
          <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h3 className="text-sm font-semibold text-white">Fixed today</h3>
              <div className="mt-3 space-y-3">
                {todayFixedEvents.map(renderFixedEvent)}
                {!todayFixedEvents.length && <EmptyState text="No fixed event today." />}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Study blocks today</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {todayBlocks.map((block) => renderStudyBlock(block))}
                {!todayBlocks.length && <EmptyState text="No generated block today. Generate a smart plan first." />}
              </div>
            </div>
          </div>
        </Panel>
      )}

      {viewMode === 'list' && (
        <Panel title="Compact List" subtitle="A fast scan of the generated week, sorted by day and time">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sortedWeekBlocks.map((block) => renderStudyBlock(block, true))}
            {!sortedWeekBlocks.length && <EmptyState text="No study block yet. Generate a smart plan first." />}
          </div>
        </Panel>
      )}

      {viewMode === 'board' && <Panel title="Weekly Board" subtitle="Fixed events stay dark; generated study blocks are highlighted for GPA focus">
        <div className="scroll-area overflow-x-auto pb-2">
          <div className="grid min-w-[1120px] grid-cols-7 gap-3">
            {weekDays.map((day) => {
              const events = data.weeklyFixedEvents.filter((event) => event.dayOfWeek === day.value).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
              const blocks = data.weeklyStudyBlocks.filter((block) => block.dayOfWeek === day.value).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
              const isToday = day.value === todayDay
              return (
                <section key={day.value} className={`surface-card rounded-lg border p-3 ${isToday ? 'border-cyan-400/60 bg-cyan-400/10' : 'border-zinc-800 bg-zinc-900/50'}`}>
                  <div className="sticky top-0 z-10 -mx-3 -mt-3 flex items-center justify-between gap-2 rounded-t-lg border-b border-zinc-800 bg-zinc-950/90 px-3 py-3 backdrop-blur">
                    <h3 className="font-semibold text-white">{day.label}</h3>
                    <Badge>{events.length + blocks.length} item</Badge>
                  </div>
                  <div className="mt-3 space-y-3">
                    {events.map(renderFixedEvent)}
                    {blocks.map((block) => renderStudyBlock(block))}
                    {!events.length && !blocks.length && <div className="rounded-lg border border-dashed border-zinc-800 p-4 text-center text-sm text-zinc-500">No schedule</div>}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </Panel>}
    </div>
  )
}

function DailyPlanner({
  data,
  onUpdateTasks,
  onUpdateStudySessions,
  onUpdateStudyBlocks,
  onUpdateDailyExecution,
  onStartFocus,
  onOpenSubject,
}: {
  data: AppData
  onUpdateTasks: (tasks: DailyTask[]) => void
  onUpdateStudySessions: (sessions: StudySession[]) => void
  onUpdateStudyBlocks: (blocks: WeeklyStudyBlock[]) => void
  onUpdateDailyExecution: (tasks: DailyTask[], blocks: WeeklyStudyBlock[]) => void
  onStartFocus: (target: FocusTarget) => void
  onOpenSubject: (subjectCode: string) => void
}) {
  const [title, setTitle] = useState('')
  const [lane, setLane] = useState<DailyTask['lane']>('GPA')
  const [subjectCode, setSubjectCode] = useState('')
  const [sessionMinutes, setSessionMinutes] = useState('45')
  const [sessionLane, setSessionLane] = useState<DailyTask['lane']>('GPA')
  const [sessionSubjectCode, setSessionSubjectCode] = useState('')
  const [sessionNote, setSessionNote] = useState('')
  const doneCount = data.dailyTasks.filter((task) => task.done).length
  const progressPercent = data.dailyTasks.length ? (doneCount / data.dailyTasks.length) * 100 : 0
  const activeTasks = data.dailyTasks.filter((task) => !task.done)
  const completedTasks = data.dailyTasks.filter((task) => task.done)
  const todaySessions = data.studySessions.filter((session) => session.date === today)
  const todayMinutes = todaySessions.reduce((sum, session) => sum + session.minutes, 0)
  const now = new Date()
  const todayDay = getIsoDay(now)
  const todayFixedEvents = data.weeklyFixedEvents.filter((event) => isEventOnDate(event, now)).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
  const todayWeeklyBlocks = data.weeklyStudyBlocks.filter((block) => block.dayOfWeek === todayDay).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
  const nextWeeklyBlock = todayWeeklyBlocks.find((block) => !block.done)
  const nextTask = activeTasks.find((task) => task.lane === 'GPA') ?? activeTasks[0]
  const laneOptions: DailyTask['lane'][] = ['GPA', 'CP', 'CS_SE']
  const laneLabels: Record<DailyTask['lane'], string> = {
    GPA: 'GPA recovery',
    CP: 'CP/programming',
    CS_SE: 'CS/SE project',
  }
  const prioritySubjects = data.curriculumSubjects
    .filter((subject) => subject.completionStatus !== 'completed')
    .filter((subject) => ['watch', 'high', 'critical'].includes(subject.riskLevel) || subject.importance === 'critical')
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
    .slice(0, 5)

  const updateTask = (taskId: string, patch: Partial<DailyTask>) => {
    const currentTask = data.dailyTasks.find((task) => task.id === taskId)
    const nextTasks = data.dailyTasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task))
    if (typeof patch.done === 'boolean' && currentTask?.weeklyBlockId) {
      const nextBlocks = data.weeklyStudyBlocks.map((block) => (block.id === currentTask.weeklyBlockId ? { ...block, done: patch.done! } : block))
      onUpdateDailyExecution(nextTasks, nextBlocks)
      return
    }
    onUpdateTasks(nextTasks)
  }

  const removeTask = (taskId: string) => {
    const currentTask = data.dailyTasks.find((task) => task.id === taskId)
    const nextTasks = data.dailyTasks.filter((task) => task.id !== taskId)
    if (currentTask?.weeklyBlockId) {
      const nextBlocks = data.weeklyStudyBlocks.map((block) => (block.id === currentTask.weeklyBlockId ? { ...block, taskId: undefined } : block))
      onUpdateDailyExecution(nextTasks, nextBlocks)
      return
    }
    onUpdateTasks(nextTasks)
  }

  const addTask = () => {
    const cleanedTitle = title.trim()
    if (!cleanedTitle) return
    onUpdateTasks([
      ...data.dailyTasks,
      {
        id: crypto.randomUUID(),
        title: cleanedTitle,
        lane,
        subjectCode: subjectCode || undefined,
        source: 'manual',
        dueDate: today,
        done: false,
      },
    ])
    setTitle('')
    setSubjectCode('')
  }

  const addTaskFromSubject = (subject: CurriculumSubject) => {
    const inferredLane: DailyTask['lane'] = subject.tags.includes('CP') ? 'CP' : subject.tags.includes('SE') ? 'CS_SE' : 'GPA'
    onUpdateTasks(addUniqueDailyTask(data.dailyTasks, {
      title: `Lộ trình: ${subject.code} - ${subject.name}`,
      lane: inferredLane,
      subjectCode: subject.code,
      source: 'roadmap',
      dueDate: today,
    }))
  }

  const resetToday = () => {
    onUpdateTasks(data.dailyTasks.map((task) => ({ ...task, done: false })))
  }

  const addBlockTask = (block: WeeklyStudyBlock) => {
    const existingTask = data.dailyTasks.find((task) => task.weeklyBlockId === block.id)
    if (existingTask) return
    const subject = data.curriculumSubjects.find((item) => item.code === block.subjectCode)
    const taskId = crypto.randomUUID()
    const task: DailyTask = {
      id: taskId,
      title: `Weekly Plan: ${block.subjectCode}${subject ? ` - ${subject.name}` : ''}`,
      lane: block.lane,
      subjectCode: block.subjectCode,
      weeklyBlockId: block.id,
      source: 'roadmap',
      dueDate: today,
      done: false,
    }
    const nextTasks = [...data.dailyTasks, task]
    const nextBlocks = data.weeklyStudyBlocks.map((item) => (item.id === block.id ? { ...item, taskId } : item))
    onUpdateDailyExecution(nextTasks, nextBlocks)
  }

  const updateWeeklyBlockDone = (block: WeeklyStudyBlock, done: boolean) => {
    const nextBlocks = data.weeklyStudyBlocks.map((item) => (item.id === block.id ? { ...item, done } : item))
    const linkedTask = data.dailyTasks.find((task) => task.weeklyBlockId === block.id)
    if (linkedTask) {
      const nextTasks = data.dailyTasks.map((task) => (task.id === linkedTask.id ? { ...task, done } : task))
      onUpdateDailyExecution(nextTasks, nextBlocks)
      return
    }
    onUpdateStudyBlocks(nextBlocks)
  }

  const startNextFocus = () => {
    if (nextTask) {
      onStartFocus({ label: nextTask.title, lane: nextTask.lane, subjectCode: nextTask.subjectCode, taskId: nextTask.id, studyBlockId: nextTask.weeklyBlockId })
      return
    }
    if (nextWeeklyBlock) {
      onStartFocus({ label: `Weekly Plan: ${nextWeeklyBlock.subjectCode}`, lane: nextWeeklyBlock.lane, subjectCode: nextWeeklyBlock.subjectCode, studyBlockId: nextWeeklyBlock.id })
    }
  }

  const logSession = () => {
    const minutes = Math.max(1, Math.round(Number(sessionMinutes) || 0))
    onUpdateStudySessions([
      ...data.studySessions,
      { id: crypto.randomUUID(), date: today, lane: sessionLane, minutes, subjectCode: sessionSubjectCode || undefined, note: sessionNote.trim() },
    ])
    setSessionNote('')
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg border border-cyan-400/20 p-5">
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="success">Daily Execution</Badge>
              <Badge>{todayFixedEvents.length} fixed</Badge>
              <Badge>{todayWeeklyBlocks.filter((block) => !block.done).length} blocks left</Badge>
              <Badge>{activeTasks.length} active tasks</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Today Command Center</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">Run today in one place: check the schedule, pick the next GPA action, then start the shared Pomodoro timer.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" className="btn-primary" disabled={!nextTask && !nextWeeklyBlock} onClick={startNextFocus}>
                <Target className="h-4 w-4" />
                Start next focus
              </button>
              {nextWeeklyBlock && (
                <button type="button" className="chip" onClick={() => addBlockTask(nextWeeklyBlock)}>
                  <Plus className="h-4 w-4" />
                  Add next block to Daily
                </button>
              )}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
            <div className="surface-card rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
              <p className="text-xs text-zinc-500">Next task</p>
              <p className="mt-1 truncate font-semibold text-white">{nextTask?.title ?? 'No active task'}</p>
              {nextTask?.subjectCode && <p className="mt-1 text-xs text-cyan-200">{nextTask.subjectCode}</p>}
            </div>
            <div className="surface-card rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
              <p className="text-xs text-zinc-500">Next weekly block</p>
              <p className="mt-1 font-semibold text-white">{nextWeeklyBlock ? `${nextWeeklyBlock.startTime}-${nextWeeklyBlock.endTime}` : 'No block left'}</p>
              {nextWeeklyBlock && <p className="mt-1 text-xs text-cyan-200">{nextWeeklyBlock.subjectCode}</p>}
            </div>
            <div className="surface-card rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
              <p className="text-xs text-zinc-500">Study minutes</p>
              <p className="mt-1 font-semibold text-white">{todayMinutes} min</p>
              <p className="mt-1 text-xs text-zinc-500">{todaySessions.length} session(s)</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={ListChecks} label="Daily Tasks" value={data.dailyTasks.length} helper="tasks in today focus" />
        <MetricCard icon={CheckCircle2} label="Completed" value={`${doneCount}/${data.dailyTasks.length}`} helper={`${Math.round(progressPercent)}% today`} />
        <MetricCard icon={Target} label="Active" value={activeTasks.length} helper="left before review" />
        <MetricCard icon={AlertTriangle} label="Study Minutes" value={todayMinutes} helper={`${todaySessions.length} session(s) today`} />
      </div>

      <Panel title="Today Execution" subtitle="Work list for the current day">
        <Progress value={progressPercent} />
        <div className="mt-4 grid gap-3">
          {activeTasks.map((task) => (
            <DailyTaskRow key={task.id} task={task} onUpdate={updateTask} onRemove={removeTask} onStartFocus={onStartFocus} onOpenSubject={onOpenSubject} />
          ))}
          {!activeTasks.length && <EmptyState text="No active task. Add one or reset the completed list." />}
        </div>
      </Panel>

      <Panel title="From Weekly Plan" subtitle="Study blocks scheduled for today, linked with Daily tasks">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {todayWeeklyBlocks.map((block) => {
            const linkedTask = data.dailyTasks.find((task) => task.weeklyBlockId === block.id)
            return (
              <div key={block.id} className={`interactive-card rounded-lg border p-3 ${block.done ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-cyan-400/40 bg-cyan-400/10'}`}>
                <div className="flex flex-wrap gap-2">
                  <Badge>{block.startTime}-{block.endTime}</Badge>
                  <Badge>{block.subjectCode}</Badge>
                  <Badge>{block.done ? 'done' : block.lane}</Badge>
                  {linkedTask && <Badge tone="success">daily</Badge>}
                </div>
                <p className="mt-2 text-sm font-medium text-zinc-100">{block.reason}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="btn-primary" onClick={() => onStartFocus({ label: linkedTask?.title ?? `Weekly Plan: ${block.subjectCode}`, lane: block.lane, subjectCode: block.subjectCode, taskId: linkedTask?.id, studyBlockId: block.id })}>Focus</button>
                  <button type="button" className="chip" disabled={Boolean(linkedTask)} onClick={() => addBlockTask(block)}>{linkedTask ? 'Added' : 'Add Daily'}</button>
                  <button type="button" className="chip" onClick={() => updateWeeklyBlockDone(block, !block.done)}>{block.done ? 'Undo' : 'Done'}</button>
                </div>
              </div>
            )
          })}
          {!todayWeeklyBlocks.length && <EmptyState text="No weekly block today. Generate a Weekly Plan first." />}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Panel title="Add Task" subtitle="Keep each task small enough to finish today">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_auto]">
            <Input label="Task title" value={title} onChange={setTitle} />
            <Select label="Lane" value={lane} onChange={(value) => setLane(value as DailyTask['lane'])} options={laneOptions} />
            <Select label="Subject" value={subjectCode} onChange={setSubjectCode} options={['', ...data.curriculumSubjects.map((subject) => subject.code)]} />
            <div className="flex items-end">
              <button type="button" className="btn-primary w-full justify-center" onClick={addTask}>
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="Lane Balance" subtitle="Daily load by recovery lane">
          <div className="grid gap-3">
            {laneOptions.map((item) => {
              const laneTasks = data.dailyTasks.filter((task) => task.lane === item)
              const laneDone = laneTasks.filter((task) => task.done).length
              return (
                <div key={item} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{laneLabels[item]}</p>
                    <Badge>{`${laneDone}/${laneTasks.length}`}</Badge>
                  </div>
                  <Progress value={laneTasks.length ? (laneDone / laneTasks.length) * 100 : 0} />
                </div>
              )
            })}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1fr]">
        <Panel title="Priority Suggestions" subtitle="Generated from roadmap risk and importance">
          <div className="grid gap-3">
            {prioritySubjects.map((subject) => (
              <button key={subject.code} type="button" className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-left hover:border-cyan-400/60" onClick={() => addTaskFromSubject(subject)} onDoubleClick={() => onOpenSubject(subject.code)}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={riskTone(subject.riskLevel)}>{subject.riskLevel}</Badge>
                  <Badge tone={importanceTone(subject.importance)}>{subject.importance}</Badge>
                  <Badge>{subject.code}</Badge>
                </div>
                <p className="mt-2 font-medium text-white">{subject.name}</p>
              </button>
            ))}
            {!prioritySubjects.length && <EmptyState text="No priority suggestion right now." />}
          </div>
        </Panel>

        <Panel title="Completed Today" subtitle="Use reset when starting a new day">
          <div className="mb-4">
            <button type="button" className="flex min-h-10 items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-100 hover:border-cyan-400/60" onClick={resetToday}>
              <RotateCcw className="h-4 w-4" />
              Reset checks
            </button>
          </div>
          <div className="grid gap-3">
            {completedTasks.map((task) => (
              <DailyTaskRow key={task.id} task={task} onUpdate={updateTask} onRemove={removeTask} onStartFocus={onStartFocus} onOpenSubject={onOpenSubject} />
            ))}
            {!completedTasks.length && <EmptyState text="No completed task yet." />}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Log Study Session" subtitle="Record real minutes, not only task completion">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Minutes" type="number" value={sessionMinutes} onChange={setSessionMinutes} />
            <Select label="Lane" value={sessionLane} onChange={(value) => setSessionLane(value as DailyTask['lane'])} options={laneOptions} />
            <Select label="Subject" value={sessionSubjectCode} onChange={setSessionSubjectCode} options={['', ...data.curriculumSubjects.map((subject) => subject.code)]} />
            <div className="flex items-end">
              <button type="button" className="btn-primary w-full justify-center" onClick={logSession}>
                <Plus className="h-4 w-4" />
                Log Session
              </button>
            </div>
          </div>
          <div className="mt-4">
            <Input label="Note" value={sessionNote} onChange={setSessionNote} />
          </div>
        </Panel>

        <Panel title="Today's Study Log" subtitle="Used by Weekly Review">
          <div className="grid gap-3">
            {todaySessions.map((session) => (
              <div key={session.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <div className="flex flex-wrap gap-2">
                  <Badge>{session.minutes} min</Badge>
                  <Badge>{session.lane}</Badge>
                  {session.subjectCode && <button type="button" onClick={() => onOpenSubject(session.subjectCode!)}><Badge>{session.subjectCode}</Badge></button>}
                </div>
                {session.note && <p className="mt-2 text-sm text-zinc-300">{session.note}</p>}
              </div>
            ))}
            {!todaySessions.length && <EmptyState text="No study session logged today." />}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function DailyTaskRow({
  task,
  onUpdate,
  onRemove,
  onStartFocus,
  onOpenSubject,
}: {
  task: DailyTask
  onUpdate: (taskId: string, patch: Partial<DailyTask>) => void
  onRemove: (taskId: string) => void
  onStartFocus: (target: FocusTarget) => void
  onOpenSubject: (subjectCode: string) => void
}) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${task.done ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-zinc-800 bg-zinc-950'}`}>
      <button type="button" className="mt-0.5" onClick={() => onUpdate(task.id, { done: !task.done })} title={task.done ? 'Đánh dấu chưa xong' : 'Đánh dấu xong'}>
        <CheckCircle2 className={`h-5 w-5 ${task.done ? 'text-emerald-300' : 'text-zinc-500'}`} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={task.lane === 'GPA' ? 'danger' : task.lane === 'CP' ? 'warning' : 'default'}>{task.lane}</Badge>
          <Badge>{dailyTaskSourceLabel(task.source)}</Badge>
          {task.subjectCode && <button type="button" onClick={() => onOpenSubject(task.subjectCode!)}><Badge>{task.subjectCode}</Badge></button>}
          {task.weeklyBlockId && <Badge tone="success">weekly</Badge>}
        </div>
        <p className={`mt-2 font-medium ${task.done ? 'text-emerald-100 line-through decoration-emerald-300/70' : 'text-white'}`}>{task.title}</p>
      </div>
      <button type="button" className="icon-btn shrink-0" onClick={() => onRemove(task.id)} title="Bỏ khỏi hôm nay">
        <Trash2 className="h-4 w-4" />
      </button>
      <button type="button" className="btn-primary shrink-0" onClick={() => onStartFocus({ label: task.title, lane: task.lane, subjectCode: task.subjectCode, taskId: task.id, studyBlockId: task.weeklyBlockId })}>
        Focus
      </button>
    </div>
  )
}

function CpTracker({
  data,
  onUpdateCpProblems,
  onUpdateTasks,
  onStartFocus,
}: {
  data: AppData
  onUpdateCpProblems: (problems: CpProblem[]) => void
  onUpdateTasks: (tasks: DailyTask[]) => void
  onStartFocus: (target: FocusTarget) => void
}) {
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState<CpProblem['platform']>('VNOJ')
  const [topic, setTopic] = useState<CpProblem['topic']>('implementation')
  const [difficulty, setDifficulty] = useState<CpProblem['difficulty']>('easy')
  const [statusFilter, setStatusFilter] = useState<CpProblem['status'] | 'all'>('all')
  const [topicFilter, setTopicFilter] = useState<CpProblem['topic'] | 'all'>('all')
  const solved = data.cpProblems.filter((problem) => problem.status === 'solved')
  const upsolve = data.cpProblems.filter((problem) => problem.status === 'upsolve')
  const todo = data.cpProblems.filter((problem) => problem.status === 'todo')
  const solvedThisWeek = solved.filter((problem) => problem.solvedAt && getWeekStart(new Date(problem.solvedAt)).toISOString().slice(0, 10) === getWeekStart(new Date()).toISOString().slice(0, 10))
  const filteredProblems = data.cpProblems
    .filter((problem) => statusFilter === 'all' || problem.status === statusFilter)
    .filter((problem) => topicFilter === 'all' || problem.topic === topicFilter)
    .sort((a, b) => cpStatusScore(a.status) - cpStatusScore(b.status) || cpDifficultyScore(b.difficulty) - cpDifficultyScore(a.difficulty))

  const updateProblem = (problemId: string, patch: Partial<CpProblem>) => {
    onUpdateCpProblems(data.cpProblems.map((problem) => (problem.id === problemId ? { ...problem, ...patch } : problem)))
  }

  const removeProblem = (problemId: string) => {
    onUpdateCpProblems(data.cpProblems.filter((problem) => problem.id !== problemId))
  }

  const addProblem = () => {
    const cleanedTitle = title.trim()
    if (!cleanedTitle) return
    onUpdateCpProblems([
      ...data.cpProblems,
      {
        id: crypto.randomUUID(),
        title: cleanedTitle,
        platform,
        topic,
        difficulty,
        status: 'todo',
      },
    ])
    setTitle('')
  }

  const markSolved = (problem: CpProblem) => {
    updateProblem(problem.id, { status: 'solved', solvedAt: new Date().toISOString() })
  }

  const addDailyCpTask = (problem: CpProblem) => {
    onUpdateTasks(addUniqueDailyTask(data.dailyTasks, {
      title: `CP: ${problem.title}`,
      lane: 'CP',
      subjectCode: 'TIN3083',
      source: 'cp',
      dueDate: today,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={BarChart3} label="Đã giải" value={solved.length} helper={`${solvedThisWeek.length} bài trong tuần`} />
        <MetricCard icon={AlertTriangle} label="Cần upsolve" value={upsolve.length} helper="bài sai phải làm lại" />
        <MetricCard icon={ListChecks} label="Cần làm" value={todo.length} helper="sẵn sàng luyện tập" />
        <MetricCard icon={Target} label="Luật tuần" value="3 + 2" helper="3 bài mới, 2 upsolve" />
      </div>

      <Panel title="Nguyên tắc luyện CP" subtitle="Luyện tập chỉ tính khi bài sai được upsolve">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            'Bắt đầu từ implementation trước khi lên chủ đề khó.',
            'Bài contest làm sai phải đưa vào hàng đợi upsolve.',
            'CP hỗ trợ TIN3083, TIN1083 và DSA sau này.',
          ].map((rule) => (
            <div key={rule} className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm text-cyan-100">{rule}</div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Panel title="Thêm bài CP" subtitle="Ghi bài nhỏ, cụ thể, có thể làm ngay">
          <div className="grid gap-4 lg:grid-cols-[1fr_160px_160px_140px_auto]">
            <Input label="Tên bài" value={title} onChange={setTitle} />
            <Select label="Nền tảng" value={platform} onChange={(value) => setPlatform(value as CpProblem['platform'])} options={cpPlatforms} />
            <Select label="Chủ đề" value={topic} onChange={(value) => setTopic(value as CpProblem['topic'])} options={cpTopics} />
            <Select label="Độ khó" value={difficulty} onChange={(value) => setDifficulty(value as CpProblem['difficulty'])} options={cpDifficulties} />
            <div className="flex items-end">
              <button type="button" className="btn-primary w-full justify-center" onClick={addProblem}>
                <Plus className="h-4 w-4" />
                Thêm
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="Bộ lọc" subtitle="Tập trung vào hàng đợi cần xử lý tiếp theo">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Trạng thái" value={statusFilter} onChange={(value) => setStatusFilter(value as CpProblem['status'] | 'all')} options={['all', 'todo', 'upsolve', 'solved']} />
            <Select label="Chủ đề" value={topicFilter} onChange={(value) => setTopicFilter(value as CpProblem['topic'] | 'all')} options={['all', ...cpTopics]} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Hàng đợi bài tập" subtitle="Di chuyển bài qua cần làm, upsolve, đã giải">
          <div className="grid gap-3">
            {filteredProblems.map((problem) => (
              <CpProblemRow key={problem.id} problem={problem} onUpdate={updateProblem} onRemove={removeProblem} onSolved={markSolved} onAddDailyTask={addDailyCpTask} onStartFocus={onStartFocus} />
            ))}
            {!filteredProblems.length && <EmptyState text="Không có bài CP khớp bộ lọc hiện tại." />}
          </div>
        </Panel>

        <Panel title="Ưu tiên upsolve" subtitle="Hàng đợi giá trị nhất trước khi làm bài mới">
          <div className="grid gap-3">
            {upsolve.map((problem) => (
              <button key={problem.id} type="button" className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-left hover:border-amber-300" onClick={() => addDailyCpTask(problem)}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="warning">{problem.platform}</Badge>
                  <Badge>{problem.topic}</Badge>
                  <Badge>{cpDifficultyLabel(problem.difficulty)}</Badge>
                </div>
                <p className="mt-2 font-medium text-white">{problem.title}</p>
                {problem.note && <p className="mt-1 text-sm text-amber-100">{problem.note}</p>}
              </button>
            ))}
            {!upsolve.length && <EmptyState text="Chưa có bài upsolve. Thêm một bài sau khi làm sai contest/bài tập." />}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function CpProblemRow({
  problem,
  onUpdate,
  onRemove,
  onSolved,
  onAddDailyTask,
  onStartFocus,
}: {
  problem: CpProblem
  onUpdate: (problemId: string, patch: Partial<CpProblem>) => void
  onRemove: (problemId: string) => void
  onSolved: (problem: CpProblem) => void
  onAddDailyTask: (problem: CpProblem) => void
  onStartFocus: (target: FocusTarget) => void
}) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={problem.status === 'solved' ? 'success' : problem.status === 'upsolve' ? 'warning' : 'default'}>{cpStatusLabel(problem.status)}</Badge>
            <Badge>{problem.platform}</Badge>
            <Badge>{problem.topic}</Badge>
            <Badge tone={problem.difficulty === 'hard' ? 'danger' : problem.difficulty === 'medium' ? 'warning' : 'default'}>{cpDifficultyLabel(problem.difficulty)}</Badge>
          </div>
          <h3 className="mt-2 font-semibold text-white">{problem.title}</h3>
          {problem.note && <p className="mt-1 text-sm text-zinc-400">{problem.note}</p>}
          {problem.solvedAt && <p className="mt-1 text-xs text-zinc-500">Đã giải {new Date(problem.solvedAt).toLocaleDateString('vi-VN')}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" className="icon-btn" onClick={() => onAddDailyTask(problem)} title="Đưa vào hôm nay">
            <Plus className="h-4 w-4" />
          </button>
          <button type="button" className="chip" onClick={() => onStartFocus({ label: `CP: ${problem.title}`, lane: 'CP', subjectCode: 'TIN3083' })}>
            Focus
          </button>
          <button type="button" className="icon-btn" onClick={() => onUpdate(problem.id, { status: 'upsolve' })} title="Đánh dấu upsolve">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button type="button" className="icon-btn" onClick={() => onSolved(problem)} title="Đánh dấu đã giải">
            <CheckCircle2 className="h-4 w-4" />
          </button>
          <button type="button" className="icon-btn" onClick={() => onRemove(problem.id)} title="Xóa bài">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

function cpStatusScore(status: CpProblem['status']) {
  return { upsolve: 0, todo: 1, solved: 2 }[status]
}

function cpDifficultyScore(difficulty: CpProblem['difficulty']) {
  return { easy: 1, medium: 2, hard: 3 }[difficulty]
}

function ProjectLab({
  data,
  onUpdateProjects,
  onUpdateTasks,
  onStartFocus,
}: {
  data: AppData
  onUpdateProjects: (projects: StudyProject[]) => void
  onUpdateTasks: (tasks: DailyTask[]) => void
  onStartFocus: (target: FocusTarget) => void
}) {
  const [name, setName] = useState('')
  const [track, setTrack] = useState<StudyProject['track']>('frontend')
  const [priority, setPriority] = useState<StudyProject['priority']>('medium')
  const [subjectCode, setSubjectCode] = useState('')
  const activeProjects = data.projects.filter((project) => project.status !== 'done')
  const doneProjects = data.projects.filter((project) => project.status === 'done')
  const criticalProjects = data.projects.filter((project) => ['critical', 'high'].includes(project.priority) && project.status !== 'done')
  const totalMilestones = data.projects.reduce((sum, project) => sum + project.milestones.length, 0)
  const doneMilestones = data.projects.reduce((sum, project) => sum + project.milestones.filter((milestone) => milestone.done).length, 0)

  const updateProject = (projectId: string, patch: Partial<StudyProject>) => {
    onUpdateProjects(data.projects.map((project) => (project.id === projectId ? { ...project, ...patch } : project)))
  }

  const removeProject = (projectId: string) => {
    onUpdateProjects(data.projects.filter((project) => project.id !== projectId))
  }

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    onUpdateProjects(data.projects.map((project) => {
      if (project.id !== projectId) return project
      return {
        ...project,
        milestones: project.milestones.map((milestone) => (milestone.id === milestoneId ? { ...milestone, done: !milestone.done } : milestone)),
      }
    }))
  }

  const addMilestone = (projectId: string, title: string) => {
    const cleanedTitle = title.trim()
    if (!cleanedTitle) return
    onUpdateProjects(data.projects.map((project) => {
      if (project.id !== projectId) return project
      return {
        ...project,
        milestones: [...project.milestones, { id: crypto.randomUUID(), title: cleanedTitle, done: false }],
      }
    }))
  }

  const updateMilestoneTitle = (projectId: string, milestoneId: string, title: string) => {
    onUpdateProjects(data.projects.map((project) => {
      if (project.id !== projectId) return project
      return {
        ...project,
        milestones: project.milestones.map((milestone) => (milestone.id === milestoneId ? { ...milestone, title } : milestone)),
      }
    }))
  }

  const removeMilestone = (projectId: string, milestoneId: string) => {
    onUpdateProjects(data.projects.map((project) => {
      if (project.id !== projectId) return project
      return {
        ...project,
        milestones: project.milestones.filter((milestone) => milestone.id !== milestoneId),
      }
    }))
  }

  const addProject = () => {
    const cleanedName = name.trim()
    if (!cleanedName) return
    onUpdateProjects([
      ...data.projects,
      {
        id: crypto.randomUUID(),
        name: cleanedName,
        track,
        status: 'idea',
        priority,
        subjectCode: subjectCode || undefined,
        goal: 'Biến một phần kiến thức yếu thành sản phẩm hoặc ghi chú dùng được.',
        nextAction: 'Xác định demo nhỏ nhất có thể hoàn thành trong tuần này.',
        milestones: [
          { id: crypto.randomUUID(), title: 'Chốt phạm vi', done: false },
          { id: crypto.randomUUID(), title: 'Làm bản chạy được đầu tiên', done: false },
          { id: crypto.randomUUID(), title: 'Review và ghi lại bài học', done: false },
        ],
      },
    ])
    setName('')
    setSubjectCode('')
  }

  const addProjectTask = (project: StudyProject) => {
    onUpdateTasks(addUniqueDailyTask(data.dailyTasks, {
      title: `Project: ${project.nextAction}`,
      lane: project.track === 'frontend' || project.track === 'portfolio' || project.track === 'fullstack' ? 'CS_SE' : 'GPA',
      subjectCode: project.subjectCode,
      source: 'project',
      dueDate: today,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={BookOpen} label="Dự án đang mở" value={activeProjects.length} helper={`${doneProjects.length} đã xong`} />
        <MetricCard icon={AlertTriangle} label="Ưu tiên cao" value={criticalProjects.length} helper="nên xử lý trước" />
        <MetricCard icon={CheckCircle2} label="Mốc tiến độ" value={`${doneMilestones}/${totalMilestones}`} helper={`${totalMilestones ? Math.round((doneMilestones / totalMilestones) * 100) : 0}% hoàn thành`} />
        <MetricCard icon={Target} label="Trọng tâm" value="Learning OS" helper="học bằng sản phẩm thật" />
      </div>

      <Panel title="Nguyên tắc project" subtitle="Project nên sửa điểm yếu và tạo bằng chứng học tập nhìn thấy được">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            'Mỗi project phải có một hành động tiếp theo.',
            'Ưu tiên demo nhỏ hơn ý tưởng lớn nhưng dang dở.',
            'Luôn gắn project với môn học, portfolio hoặc kỹ năng cụ thể.',
          ].map((rule) => (
            <div key={rule} className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm text-cyan-100">{rule}</div>
          ))}
        </div>
      </Panel>

      <Panel title="Thêm project" subtitle="Tạo một project nhỏ để phục hồi hoặc chứng minh năng lực">
        <div className="grid gap-4 lg:grid-cols-[1fr_160px_160px_180px_auto]">
          <Input label="Tên project" value={name} onChange={setName} />
          <Select label="Mảng" value={track} onChange={(value) => setTrack(value as StudyProject['track'])} options={projectTracks} />
          <Select label="Ưu tiên" value={priority} onChange={(value) => setPriority(value as StudyProject['priority'])} options={projectPriorities} />
          <Select label="Môn liên quan" value={subjectCode} onChange={setSubjectCode} options={['', ...data.curriculumSubjects.map((subject) => subject.code)]} />
          <div className="flex items-end">
            <button type="button" className="btn-primary w-full justify-center" onClick={addProject}>
              <Plus className="h-4 w-4" />
              Thêm
            </button>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        {data.projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onUpdate={updateProject}
            onRemove={removeProject}
            onToggleMilestone={toggleMilestone}
            onAddMilestone={addMilestone}
            onUpdateMilestoneTitle={updateMilestoneTitle}
            onRemoveMilestone={removeMilestone}
            onAddTask={addProjectTask}
            onStartFocus={onStartFocus}
          />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  onUpdate,
  onRemove,
  onToggleMilestone,
  onAddMilestone,
  onUpdateMilestoneTitle,
  onRemoveMilestone,
  onAddTask,
  onStartFocus,
}: {
  project: StudyProject
  onUpdate: (projectId: string, patch: Partial<StudyProject>) => void
  onRemove: (projectId: string) => void
  onToggleMilestone: (projectId: string, milestoneId: string) => void
  onAddMilestone: (projectId: string, title: string) => void
  onUpdateMilestoneTitle: (projectId: string, milestoneId: string, title: string) => void
  onRemoveMilestone: (projectId: string, milestoneId: string) => void
  onAddTask: (project: StudyProject) => void
  onStartFocus: (target: FocusTarget) => void
}) {
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('')
  const doneMilestones = project.milestones.filter((milestone) => milestone.done).length
  const progress = project.milestones.length ? (doneMilestones / project.milestones.length) * 100 : 0

  const addMilestone = () => {
    onAddMilestone(project.id, newMilestoneTitle)
    setNewMilestoneTitle('')
  }

  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={projectPriorityTone(project.priority)}>{projectPriorityLabel(project.priority)}</Badge>
            <Badge>{project.track}</Badge>
            <Badge>{projectStatusLabel(project.status)}</Badge>
            {project.subjectCode && <Badge>{project.subjectCode}</Badge>}
          </div>
          <h3 className="mt-3 text-lg font-semibold text-white">{project.name}</h3>
          <p className="mt-2 text-sm text-zinc-300">{project.goal}</p>
        </div>
        <button type="button" className="icon-btn" onClick={() => onRemove(project.id)} title="Xóa project">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Select label="Trạng thái" value={project.status} onChange={(value) => onUpdate(project.id, { status: value as StudyProject['status'] })} options={projectStatuses} />
        <Select label="Ưu tiên" value={project.priority} onChange={(value) => onUpdate(project.id, { priority: value as StudyProject['priority'] })} options={projectPriorities} />
      </div>

      <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white">Hành động tiếp theo</p>
          <button type="button" className="flex min-h-9 items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-100 hover:border-cyan-400/60" onClick={() => onAddTask(project)}>
            <Plus className="h-4 w-4" />
            Đưa vào hôm nay
          </button>
          <button type="button" className="btn-primary" onClick={() => onStartFocus({ label: `Project: ${project.nextAction}`, lane: project.track === 'frontend' || project.track === 'portfolio' || project.track === 'fullstack' ? 'CS_SE' : 'GPA', subjectCode: project.subjectCode })}>
            Focus
          </button>
        </div>
        <TextArea label="" value={project.nextAction} onChange={(nextAction) => onUpdate(project.id, { nextAction })} />
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white">Mốc tiến độ</p>
          <Badge>{`${doneMilestones}/${project.milestones.length}`}</Badge>
        </div>
        <Progress value={progress} />
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input label="Mốc mới" value={newMilestoneTitle} onChange={setNewMilestoneTitle} />
          <div className="flex items-end">
            <button type="button" className="btn-primary w-full justify-center" onClick={addMilestone}>
              <Plus className="h-4 w-4" />
              Thêm mốc
            </button>
          </div>
        </div>
        <div className="mt-3 grid gap-2">
          {project.milestones.map((milestone) => (
            <div key={milestone.id} className={`grid gap-3 rounded-lg border p-3 sm:grid-cols-[auto_1fr_auto] ${milestone.done ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-zinc-800 bg-zinc-950'}`}>
              <button type="button" className="mt-1" onClick={() => onToggleMilestone(project.id, milestone.id)} title={milestone.done ? 'Đánh dấu đang làm' : 'Đánh dấu hoàn thành'}>
                <CheckCircle2 className={`h-5 w-5 shrink-0 ${milestone.done ? 'text-emerald-300' : 'text-zinc-500'}`} />
              </button>
              <input
                className={`field min-h-10 ${milestone.done ? 'text-emerald-100 line-through decoration-emerald-300/70' : 'text-zinc-100'}`}
                value={milestone.title}
                onChange={(event) => onUpdateMilestoneTitle(project.id, milestone.id, event.target.value)}
                aria-label="Tên mốc"
              />
              <button type="button" className="icon-btn" onClick={() => onRemoveMilestone(project.id, milestone.id)} title="Xóa mốc">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {!project.milestones.length && <EmptyState text="Chưa có mốc tiến độ. Thêm một mốc nhỏ để bắt đầu theo dõi project." />}
        </div>
      </div>
    </article>
  )
}

function projectPriorityTone(priority: StudyProject['priority']): 'default' | 'success' | 'warning' | 'danger' {
  if (priority === 'critical' || priority === 'high') return 'danger'
  if (priority === 'medium') return 'warning'
  return 'default'
}

function projectPriorityLabel(priority: StudyProject['priority']) {
  return {
    low: 'thấp',
    medium: 'vừa',
    high: 'cao',
    critical: 'rất cao',
  }[priority]
}

function projectStatusLabel(status: StudyProject['status']) {
  return {
    idea: 'ý tưởng',
    planning: 'lên kế hoạch',
    building: 'đang làm',
    review: 'review',
    done: 'xong',
  }[status]
}

function cpStatusLabel(status: CpProblem['status']) {
  return {
    todo: 'cần làm',
    upsolve: 'upsolve',
    solved: 'đã giải',
  }[status]
}

function cpDifficultyLabel(difficulty: CpProblem['difficulty']) {
  return {
    easy: 'dễ',
    medium: 'vừa',
    hard: 'khó',
  }[difficulty]
}

function focusModeLabel(mode: 'focus' | 'short_break' | 'long_break') {
  return {
    focus: 'Focus',
    short_break: 'Nghỉ ngắn',
    long_break: 'Nghỉ dài',
  }[mode]
}

function projectPriorityScore(priority: StudyProject['priority']) {
  return { low: 1, medium: 2, high: 3, critical: 4 }[priority]
}

function ResourceHub({
  data,
  onUpdateResources,
  onUpdateTasks,
}: {
  data: AppData
  onUpdateResources: (resources: StudyResource[]) => void
  onUpdateTasks: (tasks: DailyTask[]) => void
}) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [type, setType] = useState<StudyResource['type']>('doc')
  const [area, setArea] = useState<StudyResource['area']>('SE')
  const [subjectCode, setSubjectCode] = useState('')
  const [areaFilter, setAreaFilter] = useState<StudyResource['area'] | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StudyResource['status'] | 'all'>('all')
  const usingResources = data.resources.filter((resource) => resource.status === 'using')
  const finishedResources = data.resources.filter((resource) => resource.status === 'finished')
  const filteredResources = data.resources
    .filter((resource) => areaFilter === 'all' || resource.area === areaFilter)
    .filter((resource) => statusFilter === 'all' || resource.status === statusFilter)
    .sort((a, b) => resourceStatusScore(a.status) - resourceStatusScore(b.status) || a.area.localeCompare(b.area))

  const addResource = () => {
    const cleanedTitle = title.trim()
    const cleanedUrl = url.trim()
    if (!cleanedTitle || !cleanedUrl) return
    onUpdateResources([
      ...data.resources,
      {
        id: crypto.randomUUID(),
        title: cleanedTitle,
        url: normalizeUrl(cleanedUrl),
        type,
        area,
        status: 'saved',
        subjectCode: subjectCode || undefined,
        note: '',
      },
    ])
    setTitle('')
    setUrl('')
    setSubjectCode('')
  }

  const updateResource = (resourceId: string, patch: Partial<StudyResource>) => {
    onUpdateResources(data.resources.map((resource) => (resource.id === resourceId ? { ...resource, ...patch } : resource)))
  }

  const removeResource = (resourceId: string) => {
    onUpdateResources(data.resources.filter((resource) => resource.id !== resourceId))
  }

  const addResourceTask = (resource: StudyResource) => {
    onUpdateTasks([
      ...data.dailyTasks,
      {
        id: crypto.randomUUID(),
        title: `Resource: ${resource.title}`,
        lane: resource.area === 'CP' ? 'CP' : resource.area === 'SE' || resource.area === 'CS' ? 'CS_SE' : 'GPA',
        subjectCode: resource.subjectCode,
        done: false,
      },
    ])
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={BookOpen} label="Resources" value={data.resources.length} helper="saved learning links" />
        <MetricCard icon={Target} label="Using" value={usingResources.length} helper="active references" />
        <MetricCard icon={CheckCircle2} label="Finished" value={finishedResources.length} helper="reviewed resources" />
        <MetricCard icon={AlertTriangle} label="Rule" value="Use" helper="links must become tasks" />
      </div>

      <Panel title="Add Resource" subtitle="Save only resources you can act on">
        <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr_140px_140px_180px_auto]">
          <Input label="Title" value={title} onChange={setTitle} />
          <Input label="URL" value={url} onChange={setUrl} />
          <Select label="Type" value={type} onChange={(value) => setType(value as StudyResource['type'])} options={resourceTypes} />
          <Select label="Area" value={area} onChange={(value) => setArea(value as StudyResource['area'])} options={resourceAreas} />
          <Select label="Subject" value={subjectCode} onChange={setSubjectCode} options={['', ...data.curriculumSubjects.map((subject) => subject.code)]} />
          <div className="flex items-end">
            <button type="button" className="btn-primary w-full justify-center" onClick={addResource}>
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Filters" subtitle="Keep the current study context visible">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Area" value={areaFilter} onChange={(value) => setAreaFilter(value as StudyResource['area'] | 'all')} options={['all', ...resourceAreas]} />
            <Select label="Status" value={statusFilter} onChange={(value) => setStatusFilter(value as StudyResource['status'] | 'all')} options={['all', ...resourceStatuses]} />
          </div>
          <div className="mt-4 grid gap-3">
            {resourceAreas.map((item) => {
              const count = data.resources.filter((resource) => resource.area === item).length
              return (
                <button key={item} type="button" className={`flex items-center justify-between rounded-lg border p-3 text-left ${areaFilter === item ? 'border-cyan-400 bg-cyan-400/10' : 'border-zinc-800 bg-zinc-950'}`} onClick={() => setAreaFilter(item)}>
                  <span className="font-medium text-white">{item}</span>
                  <Badge>{count}</Badge>
                </button>
              )
            })}
          </div>
        </Panel>

        <Panel title="Resource Library" subtitle="Open, update status, or convert to today's task">
          <div className="grid gap-3">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} onUpdate={updateResource} onRemove={removeResource} onAddTask={addResourceTask} />
            ))}
            {!filteredResources.length && <EmptyState text="No resource matches the current filters." />}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function ResourceCard({
  resource,
  onUpdate,
  onRemove,
  onAddTask,
}: {
  resource: StudyResource
  onUpdate: (resourceId: string, patch: Partial<StudyResource>) => void
  onRemove: (resourceId: string) => void
  onAddTask: (resource: StudyResource) => void
}) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={resource.status === 'finished' ? 'success' : resource.status === 'using' ? 'warning' : 'default'}>{resource.status}</Badge>
            <Badge>{resource.area}</Badge>
            <Badge>{resource.type}</Badge>
            {resource.subjectCode && <Badge>{resource.subjectCode}</Badge>}
          </div>
          <h3 className="mt-2 font-semibold text-white">{resource.title}</h3>
          <p className="mt-1 truncate text-sm text-zinc-500">{resource.url}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <a className="icon-btn" href={resource.url} target="_blank" rel="noreferrer" title="Open resource">
            <ExternalLink className="h-4 w-4" />
          </a>
          <button type="button" className="icon-btn" onClick={() => onAddTask(resource)} title="Add to Daily Planner">
            <Plus className="h-4 w-4" />
          </button>
          <button type="button" className="icon-btn" onClick={() => onRemove(resource.id)} title="Delete resource">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[160px_160px_1fr]">
        <Select label="Status" value={resource.status} onChange={(value) => onUpdate(resource.id, { status: value as StudyResource['status'] })} options={resourceStatuses} />
        <Select label="Area" value={resource.area} onChange={(value) => onUpdate(resource.id, { area: value as StudyResource['area'] })} options={resourceAreas} />
        <Input label="Title" value={resource.title} onChange={(title) => onUpdate(resource.id, { title })} />
      </div>
      <div className="mt-3">
        <TextArea label="Note" value={resource.note ?? ''} onChange={(note) => onUpdate(resource.id, { note })} />
      </div>
    </article>
  )
}

function normalizeUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}

function resourceStatusScore(status: StudyResource['status']) {
  return { using: 0, saved: 1, finished: 2 }[status]
}

function WeeklySignal({ title, items, emptyText }: { title: string; items: string[]; emptyText: string }) {
  const visibleItems = items.filter(Boolean).slice(0, 4)
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <p className="font-semibold text-white">{title}</p>
      <div className="mt-3 space-y-2">
        {visibleItems.map((item) => (
          <p key={item} className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">{item}</p>
        ))}
        {!visibleItems.length && <p className="text-sm text-zinc-500">{emptyText}</p>}
      </div>
    </div>
  )
}

function getWeeklySummary(data: AppData) {
  const totalTasks = data.dailyTasks.length
  const doneTasks = data.dailyTasks.filter((task) => task.done).length
  const taskCompletion = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0
  const completedStudyBlocks = data.weeklyStudyBlocks.filter((block) => block.done).length
  const pomodoroMinutes = data.pomodoroSessions.reduce((sum, session) => sum + session.minutes, 0)
  const upsolveCount = data.cpProblems.filter((problem) => problem.status === 'upsolve').length
  const cpTodoCount = data.cpProblems.filter((problem) => problem.status === 'todo').length
  const blockedProjects = data.projects
    .filter((project) => project.status !== 'done' && ['critical', 'high'].includes(project.priority))
    .sort((a, b) => projectPriorityScore(b.priority) - projectPriorityScore(a.priority))
  const semesterPlan = data.semesterPlans[0]
  const unsafeSubjects = semesterPlan.subjectPlans.filter((subjectPlan) => subjectPlan.status !== 'safe')
  const openAssignmentSubjects = semesterPlan.subjectPlans
    .filter((subjectPlan) => subjectPlan.status === 'assignment')
    .map((subjectPlan) => data.curriculumSubjects.find((subject) => subject.code === subjectPlan.subjectCode))
    .filter((subject): subject is CurriculumSubject => Boolean(subject))
  const riskSubjects = data.curriculumSubjects.filter((subject) => ['watch', 'high', 'critical'].includes(subject.riskLevel)).slice(0, 5)
  const suggestedFocus = [
    riskSubjects[0] ? `Move ${riskSubjects[0].code} first` : '',
    upsolveCount ? `Clear ${upsolveCount} CP upsolve item(s)` : '',
    blockedProjects[0] ? `Project: ${blockedProjects[0].nextAction}` : '',
    unsafeSubjects[0] ? `Make ${unsafeSubjects[0].subjectCode} safe` : '',
  ].filter(Boolean).join(' | ')

  return {
    totalTasks,
    doneTasks,
    taskCompletion,
    completedStudyBlocks,
    plannedStudyBlocks: data.weeklyStudyBlocks.length,
    pomodoroMinutes,
    upsolveCount,
    cpTodoCount,
    blockedProjects,
    unsafeSubjects,
    openAssignmentSubjects,
    riskSubjects,
    suggestedFocus: suggestedFocus || 'Maintain current plan and protect GPA.',
  }
}

function WeeklyReviewPage({ data, onSaveReview }: { data: AppData; onSaveReview: (review: WeeklyReview) => void }) {
  const reviews = data.weeklyReviews
  const weekStart = getWeekStart(new Date()).toISOString().slice(0, 10)
  const existing = reviews.find((review) => review.weekStart === weekStart)
  const summary = getWeeklySummary(data)
  const [review, setReview] = useState<WeeklyReview>(
    existing ?? {
      id: crypto.randomUUID(),
      weekStart,
      riskSubject: summary.riskSubjects[0]?.code ?? '',
      assignmentStatus: summary.openAssignmentSubjects.map((subject) => subject.code).join(', '),
      cramRisk: summary.doneTasks < summary.totalTasks ? 'Task completion is not closed yet.' : 'Daily tasks are closed.',
      cpUpsolve: `${summary.upsolveCount} upsolve item(s), ${summary.cpTodoCount} CP todo item(s).`,
      nextWeekFocus: summary.suggestedFocus,
      savedAt: '',
    },
  )
  const [message, setMessage] = useState('')

  const generateNextWeekFocus = () => {
    setReview({
      ...review,
      riskSubject: summary.riskSubjects[0] ? `${summary.riskSubjects[0].code} - ${summary.riskSubjects[0].name}` : review.riskSubject,
      assignmentStatus: summary.openAssignmentSubjects.length ? summary.openAssignmentSubjects.map((subject) => subject.code).join(', ') : 'No subject marked assignment.',
      cramRisk: summary.doneTasks < summary.totalTasks ? `${summary.totalTasks - summary.doneTasks} daily task(s) still open.` : 'No open daily task.',
      cpUpsolve: `${summary.upsolveCount} upsolve item(s), ${summary.cpTodoCount} CP todo item(s).`,
      nextWeekFocus: summary.suggestedFocus,
    })
  }

  const save = () => {
    onSaveReview({ ...review, savedAt: new Date().toISOString() })
    setMessage('Weekly Review đã được lưu vào localStorage.')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={CheckCircle2} label="Daily Done" value={`${summary.doneTasks}/${summary.totalTasks}`} helper={`${summary.taskCompletion}% complete`} />
        <MetricCard icon={BarChart3} label="Weekly Blocks" value={`${summary.completedStudyBlocks}/${summary.plannedStudyBlocks}`} helper={`${summary.pomodoroMinutes} Pomodoro minutes`} />
        <MetricCard icon={BookOpen} label="Project Blocks" value={summary.blockedProjects.length} helper="active high-priority projects" />
        <MetricCard icon={AlertTriangle} label="Unsafe Subjects" value={summary.unsafeSubjects.length} helper="not marked safe yet" />
      </div>

      <Panel title="Weekly Signal" subtitle="Auto summary from Daily, CP, Project, and Semester">
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
          <WeeklySignal title="Risk subjects" items={summary.riskSubjects.map((subject) => `${subject.code} - ${subject.name}`)} emptyText="No risk subject." />
          <WeeklySignal title="CP cleanup" items={[`${summary.upsolveCount} upsolve`, `${summary.cpTodoCount} todo`]} emptyText="No CP queue." />
          <WeeklySignal title="Project next actions" items={summary.blockedProjects.map((project) => `${project.name}: ${project.nextAction}`)} emptyText="No blocked project." />
          <WeeklySignal title="Semester unsafe" items={summary.unsafeSubjects.map((item) => `${item.subjectCode}: ${item.status}, ${item.weeklyHours}h/week`)} emptyText="All semester subjects safe." />
        </div>
      </Panel>

      <Panel title="Weekly Review" subtitle="Review tuần, khóa lại ưu tiên tuần sau">
        <button type="button" className="btn-primary mb-4" onClick={generateNextWeekFocus}>
          <RotateCcw className="h-4 w-4" />
          Generate next week focus
        </button>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextArea label="1. Môn nào tuần này nguy hiểm nhất?" value={review.riskSubject} onChange={(riskSubject) => setReview({ ...review, riskSubject })} />
          <TextArea label="2. Có assignment nào chưa xong không?" value={review.assignmentStatus} onChange={(assignmentStatus) => setReview({ ...review, assignmentStatus })} />
          <TextArea label="3. Mình có học dồn không?" value={review.cramRisk} onChange={(cramRisk) => setReview({ ...review, cramRisk })} />
          <TextArea label="4. CP có upsolve không?" value={review.cpUpsolve} onChange={(cpUpsolve) => setReview({ ...review, cpUpsolve })} />
        </div>
        <div className="mt-4">
          <TextArea label="5. Môn nào cần tăng thời lượng tuần sau?" value={review.nextWeekFocus} onChange={(nextWeekFocus) => setReview({ ...review, nextWeekFocus })} />
        </div>
        <button type="button" className="btn-primary mt-4" onClick={save}>
          <Save className="h-4 w-4" />
          Save Weekly Review
        </button>
        {message && <p className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p>}
      </Panel>

      <Panel title="Review History" subtitle="Dữ liệu lưu được sau refresh">
        <div className="grid gap-3 lg:grid-cols-2">
          {reviews.map((item) => (
            <div key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <p className="font-semibold text-white">Week of {formatDate(item.weekStart)}</p>
              <p className="mt-2 text-sm text-zinc-300">{item.nextWeekFocus || 'No next focus recorded.'}</p>
              {item.savedAt && <p className="mt-2 text-xs text-zinc-500">Saved {new Date(item.savedAt).toLocaleString('vi-VN')}</p>}
            </div>
          ))}
          {!reviews.length && <EmptyState text="Chưa có weekly review nào." />}
        </div>
      </Panel>
    </div>
  )
}

function SettingsPage({
  data,
  onUpdateProfile,
  onUpdateSettings,
  onReplaceData,
  onResetData,
}: {
  data: AppData
  onUpdateProfile: (profile: AcademicProfile) => void
  onUpdateSettings: (settings: AppSettings) => void
  onReplaceData: (data: AppData) => void
  onResetData: () => void
}) {
  const [message, setMessage] = useState('')
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null)
  const [resetArmed, setResetArmed] = useState(false)
  const profile = data.academicProfile
  const backupSummary = useMemo(() => buildBackupSummary(data), [data])
  const backupIsStale = isBackupStale(data.settings.lastBackupAt)
  const backupStatus = data.settings.lastBackupAt
    ? `Backup gần nhất: ${formatDateTime(data.settings.lastBackupAt)}${data.settings.lastBackupFileName ? ` · ${data.settings.lastBackupFileName}` : ''}`
    : 'Chưa từng backup dữ liệu trên trình duyệt này.'

  const updateTarget = (key: 'targetShortTermGPA4' | 'targetScholarshipGPA4' | 'targetExcellentGPA4', value: string) => {
    onUpdateProfile({ ...profile, [key]: clampNumber(Number(value), 0, 4) })
  }

  const toggleSpecialization = (groupId: string) => {
    const selected = profile.selectedSpecializationGroupIds.includes(groupId)
    const nextIds = selected ? profile.selectedSpecializationGroupIds.filter((id) => id !== groupId) : [...profile.selectedSpecializationGroupIds, groupId]
    onUpdateProfile({ ...profile, selectedSpecializationGroupIds: nextIds })
  }

  const exportData = () => {
    const exportedAt = new Date().toISOString()
    const fileName = `hoang-learning-os-backup-${today}.json`
    const nextSettings = {
      ...data.settings,
      lastBackupAt: exportedAt,
      lastBackupFileName: fileName,
    }
    const backupData = { ...data, settings: nextSettings }
    const payload: BackupPayload = {
      schema: 'hoang-learning-os-backup',
      appName: 'Hoang Learning OS',
      dataVersion: DATA_VERSION,
      exportedAt,
      data: backupData,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
    onUpdateSettings(nextSettings)
    setMessage('Đã tạo file backup JSON có metadata.')
    setPendingImport(null)
    setResetArmed(false)
  }

  const importData = async (file: File | undefined) => {
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text()) as unknown
      const backup = parseBackupPayload(parsed)
      if (!backup) throw new Error('Invalid backup')
      setPendingImport({
        fileName: file.name,
        source: backup.source,
        dataVersion: backup.dataVersion,
        exportedAt: backup.exportedAt,
        data: backup.data,
        summary: buildBackupSummary(backup.data),
      })
      setMessage('Đã đọc file backup. Kiểm tra preview rồi xác nhận khôi phục.')
      setResetArmed(false)
    } catch {
      setPendingImport(null)
      setMessage('Import thất bại. File cần là JSON backup hợp lệ.')
    }
  }

  const confirmImport = () => {
    if (!pendingImport) return
    onReplaceData({
      ...pendingImport.data,
      settings: {
        ...pendingImport.data.settings,
        lastImportAt: new Date().toISOString(),
      },
    })
    setMessage('Khôi phục thành công. Dữ liệu đã được lưu vào localStorage.')
    setPendingImport(null)
    setResetArmed(false)
  }

  const reset = () => {
    if (!resetArmed) {
      setResetArmed(true)
      setPendingImport(null)
      setMessage('Bấm lại "Xác nhận reset" để xóa dữ liệu hiện tại và quay về dữ liệu gốc 2025-2026.2.')
      return
    }
    onResetData()
    setResetArmed(false)
    setMessage('Đã reset về dữ liệu gốc 2025-2026.2.')
  }

  return (
    <div className="space-y-6">
      <Panel title="Mục tiêu GPA" subtitle="Điều chỉnh target và lưu lại sau refresh">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Mục tiêu ngắn hạn" type="number" value={String(profile.targetShortTermGPA4)} onChange={(value) => updateTarget('targetShortTermGPA4', value)} />
          <Input label="Mục tiêu học bổng" type="number" value={String(profile.targetScholarshipGPA4)} onChange={(value) => updateTarget('targetScholarshipGPA4', value)} />
          <Input label="Mục tiêu xuất sắc" type="number" value={String(profile.targetExcellentGPA4)} onChange={(value) => updateTarget('targetExcellentGPA4', value)} />
        </div>
      </Panel>

      <Panel title="Chuyên ngành đang chọn" subtitle="Chỉ nhóm được chọn mới tính vào tiến độ chính">
        <div className="grid gap-3 md:grid-cols-3">
          {data.requirementGroups.filter((group) => group.isSpecializationOption).map((group) => {
            const selected = profile.selectedSpecializationGroupIds.includes(group.id)
            return (
              <button key={group.id} type="button" className={`rounded-lg border p-4 text-left ${selected ? 'border-cyan-400 bg-cyan-400/10' : 'border-zinc-800 bg-zinc-950'}`} onClick={() => toggleSpecialization(group.id)}>
                <Badge tone={selected ? 'success' : 'default'}>{selected ? 'Đang chọn' : 'Chưa chọn'}</Badge>
                <p className="mt-3 font-semibold text-white">{group.name}</p>
                <p className="mt-2 text-sm text-zinc-400">Tín chỉ bắt buộc của nhóm này chỉ được tính khi nhóm đang chọn.</p>
              </button>
            )
          })}
        </div>
      </Panel>

      <Panel title="Sao lưu dữ liệu cá nhân" subtitle="Dữ liệu lưu local-first trong trình duyệt, backup bằng file JSON">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success">localStorage</Badge>
              <Badge>Vercel chỉ host app</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Dữ liệu học tập của bạn đang lưu trong localStorage của trình duyệt hiện tại. Nếu đổi máy, đổi trình duyệt, xóa cache hoặc dùng tab ẩn danh, dữ liệu có thể không đi theo. Vercel không lưu dữ liệu cá nhân của bạn.
            </p>
            <div className={`mt-4 rounded-lg border p-3 text-sm ${backupIsStale ? 'border-amber-400/30 bg-amber-400/10 text-amber-100' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'}`}>
              {backupStatus}
              {data.settings.lastImportAt && <span className="mt-1 block">Import gần nhất: {formatDateTime(data.settings.lastImportAt)}</span>}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <BackupStat label="Task hôm nay" value={backupSummary.dailyTasks} />
            <BackupStat label="Daily Review" value={backupSummary.dailyReviews} />
            <BackupStat label="Bài CP" value={backupSummary.cpProblems} />
            <BackupStat label="Project" value={backupSummary.projects} />
            <BackupStat label="Môn học" value={backupSummary.subjects} />
            <BackupStat label="Lịch cố định" value={backupSummary.fixedEvents} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={exportData}>
            <Download className="h-4 w-4" />
            Tải backup JSON
          </button>
          <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 hover:border-cyan-400/60">
            <Upload className="h-4 w-4" />
            Khôi phục từ JSON
            <input
              className="hidden"
              type="file"
              accept="application/json,.json"
              onChange={(event) => {
                void importData(event.target.files?.[0])
                event.currentTarget.value = ''
              }}
            />
          </label>
          <button type="button" className="flex min-h-11 items-center gap-2 rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-100" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            {resetArmed ? 'Xác nhận reset' : 'Reset về dữ liệu gốc'}
          </button>
        </div>

        {pendingImport && (
          <div className="mt-4 rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">Preview file khôi phục</p>
                <p className="mt-1 text-sm text-cyan-100">
                  {pendingImport.fileName} · {pendingImport.source === 'backup' ? 'Backup mới' : 'Backup cũ'}{pendingImport.dataVersion ? ` · ${pendingImport.dataVersion}` : ''}{pendingImport.exportedAt ? ` · ${formatDateTime(pendingImport.exportedAt)}` : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-primary" onClick={confirmImport}>Xác nhận khôi phục</button>
                <button type="button" className="icon-btn px-3" onClick={() => setPendingImport(null)}>Hủy</button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <BackupStat label="Task" value={pendingImport.summary.dailyTasks} />
              <BackupStat label="Review" value={pendingImport.summary.dailyReviews} />
              <BackupStat label="CP" value={pendingImport.summary.cpProblems} />
              <BackupStat label="Project" value={pendingImport.summary.projects} />
              <BackupStat label="Môn" value={pendingImport.summary.subjects} />
              <BackupStat label="Lịch" value={pendingImport.summary.fixedEvents} />
            </div>
          </div>
        )}

        {message && <p className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300">{message}</p>}
      </Panel>
    </div>
  )
}

function BackupStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  )
}

function buildBackupSummary(data: AppData): BackupSummary {
  return {
    dailyTasks: data.dailyTasks.length,
    dailyReviews: data.dailyReviews.length,
    cpProblems: data.cpProblems.length,
    projects: data.projects.length,
    subjects: data.curriculumSubjects.length,
    fixedEvents: data.weeklyFixedEvents.length,
  }
}

function parseBackupPayload(value: unknown): Omit<PendingImport, 'fileName' | 'summary'> | null {
  if (!isRecord(value)) return null
  if (
    value.schema === 'hoang-learning-os-backup'
    && value.appName === 'Hoang Learning OS'
    && isRecord(value.data)
  ) {
    return {
      source: 'backup',
      dataVersion: typeof value.dataVersion === 'string' ? value.dataVersion : undefined,
      exportedAt: typeof value.exportedAt === 'string' ? value.exportedAt : undefined,
      data: normalizeData(value.data as Partial<AppData>),
    }
  }
  if ('academicProfile' in value || 'curriculumSubjects' in value || 'dailyTasks' in value) {
    return {
      source: 'legacy',
      data: normalizeData(value as Partial<AppData>),
    }
  }
  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function isBackupStale(lastBackupAt?: string) {
  if (!lastBackupAt) return true
  const backupDate = new Date(lastBackupAt)
  if (Number.isNaN(backupDate.getTime())) return true
  return Date.now() - backupDate.getTime() > 7 * 24 * 60 * 60 * 1000
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function Brand({ profile }: { profile: AcademicProfile }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-400 text-zinc-950 shadow-lg shadow-cyan-400/20">
        <Target className="h-6 w-6" />
      </div>
      <div>
        <p className="font-semibold text-white">Hoàng Learning OS</p>
        <p className="text-sm text-zinc-400">{profile.cohort} · MVP v3</p>
      </div>
    </div>
  )
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: { id: Page; label: string; icon: typeof LayoutDashboard }
  active: boolean
  onClick: () => void
}) {
  const Icon = item.icon
  return (
    <button type="button" className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium ${active ? 'bg-cyan-400 text-zinc-950 shadow-lg shadow-cyan-400/15' : 'text-zinc-300 hover:bg-zinc-900/90 hover:text-white'}`} onClick={onClick}>
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${active ? 'bg-zinc-950/10' : 'bg-zinc-900 text-cyan-300 group-hover:bg-zinc-800'}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      <ChevronRight className={`h-4 w-4 shrink-0 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
    </button>
  )
}

function SubjectCard({ subject, groupName, onOpenSubject, onAddTask }: { subject: CurriculumSubject; groupName: string; onOpenSubject?: (subjectCode: string) => void; onAddTask?: (subject: CurriculumSubject) => void }) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-400">{subject.code} · {groupName}</p>
          <button type="button" className="mt-1 text-left text-lg font-semibold text-white hover:text-cyan-200" onClick={() => onOpenSubject?.(subject.code)}>{subject.name}</button>
        </div>
        <Badge tone={subject.required ? 'success' : 'default'}>{subject.required ? 'bắt buộc' : 'tự chọn'}</Badge>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Badge>{`Tiến độ: ${subject.completionStatus}`}</Badge>
        <Badge tone={riskTone(subject.riskLevel)}>{`Rủi ro: ${subject.riskLevel}`}</Badge>
        <Badge tone={importanceTone(subject.importance)}>{`Quan trọng: ${subject.importance}`}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{subject.credits} TC</Badge>
        <Badge>HK {subject.expectedSemester}</Badge>
        <Badge>{subject.recoveryAction}</Badge>
        <Badge>Ưu tiên {getPriorityScore(subject)}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {subject.tags.map((item) => <Badge key={item}>{item}</Badge>)}
      </div>
      {subject.grade && <p className="mt-3 text-sm text-zinc-300">Điểm: {subject.grade.score10}/10 · {subject.grade.letter} · {subject.grade.point4}/4</p>}
      {subject.notes && <p className="mt-3 text-sm text-zinc-400">{subject.notes}</p>}
      {onAddTask && (
        <button type="button" className="btn-primary mt-4" onClick={() => onAddTask(subject)}>
          <Plus className="h-4 w-4" />
          Đưa vào hôm nay
        </button>
      )}
    </article>
  )
}

function SubjectAlert({ subject, onOpenSubject }: { subject: CurriculumSubject; onOpenSubject?: (subjectCode: string) => void }) {
  return (
    <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-200" />
        <Badge tone={riskTone(subject.riskLevel)}>{subject.riskLevel}</Badge>
        <Badge>{subject.recoveryAction}</Badge>
      </div>
      <button type="button" className="mt-2 text-left font-semibold text-white hover:text-cyan-200" onClick={() => onOpenSubject?.(subject.code)}>{subject.code} · {subject.name}</button>
      <p className="mt-1 text-sm text-amber-100">{subject.notes}</p>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, helper }: { icon: typeof LayoutDashboard; label: string; value: string | number; helper: string }) {
  return (
    <div className="surface-card interactive-card rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-400/20 bg-cyan-400/10">
          <Icon className="h-5 w-5 text-cyan-300" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{helper}</p>
    </div>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="glass-panel rounded-lg border border-zinc-800 p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
        </div>
        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_18px_rgb(34_211_238_/_0.75)]" />
      </div>
      {children}
    </section>
  )
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-zinc-400">{label}</span>
      <input className="field" type={type} step={type === 'number' ? '0.01' : undefined} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-zinc-400">{label}</span>
      <textarea className="field min-h-24 resize-y" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-zinc-400">{label}</span>
      <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' }) {
  const tones = {
    default: 'border-zinc-700 bg-zinc-800 text-zinc-300',
    success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
    warning: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
    danger: 'border-red-400/30 bg-red-400/10 text-red-200',
  }
  return <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>
}

function Progress({ value }: { value: number }) {
  return (
    <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-800">
      <div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-zinc-700 p-5 text-sm text-zinc-400">{text}</div>
}

function calculateGPA(subjects: CurriculumSubject[]): number {
  const completed = subjects.filter((subject) => subject.completionStatus === 'completed' && typeof subject.grade?.point4 === 'number')
  const totalCredits = completed.reduce((sum, subject) => sum + subject.credits, 0)
  const totalPoints = completed.reduce((sum, subject) => sum + subject.credits * (subject.grade?.point4 ?? 0), 0)
  return totalCredits === 0 ? 0 : Number((totalPoints / totalCredits).toFixed(2))
}

function calculateProjectedSemesterGPA(subjects: CurriculumSubject[], subjectPlans: SemesterSubjectPlan[]): number {
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0)
  const totalPoints = subjects.reduce((sum, subject) => {
    const subjectPlan = subjectPlans.find((item) => item.subjectCode === subject.code)
    return sum + subject.credits * targetGradePoint(subjectPlan?.targetGrade ?? 'B+')
  }, 0)
  return totalCredits === 0 ? 0 : Number((totalPoints / totalCredits).toFixed(2))
}

function getGpaPriorityQueue(data: AppData) {
  const semesterPlan = data.semesterPlans[0]
  return semesterPlan.subjects
    .map((code) => data.curriculumSubjects.find((subject) => subject.code === code))
    .filter((subject): subject is CurriculumSubject => Boolean(subject))
    .map((subject) => {
      const subjectPlan = semesterPlan.subjectPlans.find((item) => item.subjectCode === subject.code)
      const examBoost = data.weeklyFixedEvents.some((event) => event.subjectCode === subject.code && (event.type === 'exam' || event.type === 'deadline')) ? 4 : 0
      const riskScore = { none: 0, low: 1, watch: 3, high: 5, critical: 7 }[subject.riskLevel]
      const importanceScore = { low: 1, medium: 2, high: 3, critical: 4 }[subject.importance]
      const statusScore = subjectPlan?.status === 'safe' ? -2 : subjectPlan?.status === 'exam_review' ? 4 : subjectPlan?.status === 'assignment' ? 3 : 1
      const gradeScore = subjectPlan?.targetGrade === 'A' ? 3 : subjectPlan?.targetGrade === 'B+' ? 2 : 1
      return {
        subject,
        score: riskScore + importanceScore + statusScore + gradeScore + examBoost,
        reason: `${subject.riskLevel} risk, ${subject.importance} importance${examBoost ? ', exam/deadline' : ''}`,
      }
    })
    .sort((a, b) => b.score - a.score)
}

function generateWeeklyStudyBlocks(data: AppData): WeeklyStudyBlock[] {
  const queue = getGpaPriorityQueue(data)
  const blocks: WeeklyStudyBlock[] = []
  const slots = [
    ['07:30', '08:30'],
    ['09:00', '10:00'],
    ['10:30', '11:30'],
    ['14:00', '15:30'],
    ['16:00', '17:00'],
    ['19:30', '21:00'],
  ] as const
  const plannedMinutesBySubject = new globalThis.Map<string, number>()
  const subjectDailyCount = new globalThis.Map<string, number>()
  const dayHeavyCount = new globalThis.Map<FixedEvent['dayOfWeek'], number>()
  const targetMinutesBySubject = new globalThis.Map<string, number>()
  const semesterPlan = data.semesterPlans[0]

  semesterPlan.subjectPlans.forEach((plan) => {
    targetMinutesBySubject.set(plan.subjectCode, Math.max(60, plan.weeklyHours * 60))
  })

  weekDays.forEach((day) => {
    let created = 0
    subjectDailyCount.clear()
    for (const slot of slots) {
      if (created >= 3) break
      const subjectEntry = pickWeeklySubject(queue, data, day.value, slot[0], slot[1], plannedMinutesBySubject, targetMinutesBySubject, subjectDailyCount, dayHeavyCount, created)
      if (!subjectEntry) break
      const hasConflict = data.weeklyFixedEvents
        .filter((event) => event.dayOfWeek === day.value)
        .some((event) => timeRangesOverlapWithBuffer(slot[0], slot[1], event.startTime, event.endTime, 30))
      if (hasConflict) continue
      const duration = timeToMinutes(slot[1]) - timeToMinutes(slot[0])
      plannedMinutesBySubject.set(subjectEntry.subject.code, (plannedMinutesBySubject.get(subjectEntry.subject.code) ?? 0) + duration)
      subjectDailyCount.set(subjectEntry.subject.code, (subjectDailyCount.get(subjectEntry.subject.code) ?? 0) + 1)
      if (subjectEntry.subject.riskLevel === 'high' || subjectEntry.subject.riskLevel === 'critical') {
        dayHeavyCount.set(day.value, (dayHeavyCount.get(day.value) ?? 0) + 1)
      }
      blocks.push({
        id: crypto.randomUUID(),
        dayOfWeek: day.value,
        startTime: slot[0],
        endTime: slot[1],
        subjectCode: subjectEntry.subject.code,
        lane: subjectEntry.subject.tags.includes('CP') ? 'CP' : subjectEntry.subject.tags.includes('SE') || subjectEntry.subject.tags.includes('CS') ? 'CS_SE' : 'GPA',
        reason: getSmartBlockReason(subjectEntry, data, day.value, plannedMinutesBySubject, targetMinutesBySubject),
        source: 'auto',
        done: false,
      })
      created += 1
    }
  })

  return blocks
}

function pickWeeklySubject(
  queue: ReturnType<typeof getGpaPriorityQueue>,
  data: AppData,
  dayOfWeek: FixedEvent['dayOfWeek'],
  startTime: string,
  endTime: string,
  plannedMinutesBySubject: Map<string, number>,
  targetMinutesBySubject: Map<string, number>,
  subjectDailyCount: Map<string, number>,
  dayHeavyCount: Map<FixedEvent['dayOfWeek'], number>,
  createdToday: number,
) {
  const duration = timeToMinutes(endTime) - timeToMinutes(startTime)
  const ranked = queue
    .map((entry) => {
      const lane = entry.subject.tags.includes('CP') ? 'CP' : entry.subject.tags.includes('SE') || entry.subject.tags.includes('CS') ? 'CS_SE' : 'GPA'
      const targetMinutes = targetMinutesBySubject.get(entry.subject.code) ?? 180
      const plannedMinutes = plannedMinutesBySubject.get(entry.subject.code) ?? 0
      const remainingMinutes = targetMinutes - plannedMinutes
      const alreadyToday = subjectDailyCount.get(entry.subject.code) ?? 0
      const heavyToday = dayHeavyCount.get(dayOfWeek) ?? 0
      const examDistance = getNearestExamDistance(data, entry.subject.code, dayOfWeek)
      let score = entry.score
      score += Math.max(0, remainingMinutes) / 45
      if (examDistance !== null && examDistance <= 2) score += 5 - examDistance
      if (entry.subject.riskLevel === 'critical') score += 2
      if (entry.subject.riskLevel === 'high') score += 1
      if (alreadyToday > 0) score -= 5
      if ((entry.subject.riskLevel === 'high' || entry.subject.riskLevel === 'critical') && heavyToday >= 2) score -= 4
      if (createdToday === 0 && lane !== 'GPA') score -= 3
      if (remainingMinutes <= -duration) score -= 6
      return { entry, score }
    })
    .sort((a, b) => b.score - a.score)

  return ranked[0]?.entry
}

function getSmartBlockReason(
  entry: ReturnType<typeof getGpaPriorityQueue>[number],
  data: AppData,
  dayOfWeek: FixedEvent['dayOfWeek'],
  plannedMinutesBySubject: Map<string, number>,
  targetMinutesBySubject: Map<string, number>,
) {
  const reasons = [`${entry.subject.riskLevel} risk`, `${entry.subject.importance} importance`]
  const targetMinutes = targetMinutesBySubject.get(entry.subject.code) ?? 180
  const plannedMinutes = plannedMinutesBySubject.get(entry.subject.code) ?? 0
  const missingMinutes = Math.max(0, targetMinutes - plannedMinutes)
  const examDistance = getNearestExamDistance(data, entry.subject.code, dayOfWeek)
  if (missingMinutes > 0) reasons.push(`${Math.ceil(missingMinutes / 60)}h still needed`)
  if (examDistance !== null) reasons.push(examDistance === 0 ? 'exam/deadline today' : `exam/deadline in ${examDistance}d`)
  return reasons.join(' · ')
}

function getNearestExamDistance(data: AppData, subjectCode: string, dayOfWeek: FixedEvent['dayOfWeek']) {
  const distances = data.weeklyFixedEvents
    .filter((event) => event.subjectCode === subjectCode && (event.type === 'exam' || event.type === 'deadline'))
    .map((event) => (event.dayOfWeek - dayOfWeek + 7) % 7)
  if (!distances.length) return null
  return Math.min(...distances)
}

function getWeeklySubjectHourGaps(data: AppData) {
  const plannedBySubject = new globalThis.Map<string, number>()
  data.weeklyStudyBlocks.forEach((block) => {
    plannedBySubject.set(block.subjectCode, (plannedBySubject.get(block.subjectCode) ?? 0) + Math.max(0, timeToMinutes(block.endTime) - timeToMinutes(block.startTime)))
  })
  return data.semesterPlans[0].subjectPlans
    .map((plan) => {
      const targetMinutes = Math.max(60, plan.weeklyHours * 60)
      const plannedMinutes = plannedBySubject.get(plan.subjectCode) ?? 0
      return { subjectCode: plan.subjectCode, missingMinutes: Math.max(0, targetMinutes - plannedMinutes) }
    })
    .filter((item) => item.missingMinutes > 0)
    .sort((a, b) => b.missingMinutes - a.missingMinutes)
}

function timeRangesOverlapWithBuffer(startA: string, endA: string, startB: string, endB: string, bufferMinutes: number) {
  const aStart = timeToMinutes(startA)
  const aEnd = timeToMinutes(endA)
  const bStart = timeToMinutes(startB) - bufferMinutes
  const bEnd = timeToMinutes(endB) + bufferMinutes
  return aStart < bEnd && bStart < aEnd
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return (hours || 0) * 60 + (minutes || 0)
}

function getIsoDay(date: Date): FixedEvent['dayOfWeek'] {
  const day = date.getDay()
  return (day === 0 ? 7 : day) as FixedEvent['dayOfWeek']
}

function getWeekDayLabel(dayOfWeek: FixedEvent['dayOfWeek']) {
  return weekDays.find((day) => day.value === dayOfWeek)?.label ?? `Day ${dayOfWeek}`
}

function isEventOnDate(event: FixedEvent, date: Date) {
  const dateKey = getLocalDateKey(date)
  return event.date ? event.date === dateKey : event.dayOfWeek === getIsoDay(date)
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseLocalDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`)
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

function formatFixedEventTiming(event: FixedEvent) {
  const dateLabel = event.date ? formatDate(event.date) : getWeekDayLabel(event.dayOfWeek)
  return `${dateLabel} ${event.startTime}-${event.endTime}`
}

function getExamEvents(data: AppData) {
  return data.weeklyFixedEvents
    .filter((event) => event.type === 'exam')
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '') || timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
}

function getDaysUntil(date?: string) {
  if (!date) return 0
  const todayDate = new Date()
  const target = new Date(`${date}T00:00:00`)
  todayDate.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - todayDate.getTime()) / 86400000)
}

function createDailyTask(task: Omit<DailyTask, 'id' | 'done' | 'createdAt'> & Partial<Pick<DailyTask, 'id' | 'done' | 'createdAt'>>): DailyTask {
  return {
    ...task,
    id: task.id ?? crypto.randomUUID(),
    createdAt: task.createdAt ?? new Date().toISOString(),
    done: task.done ?? false,
  }
}

function addUniqueDailyTask(tasks: DailyTask[], task: Omit<DailyTask, 'id' | 'done' | 'createdAt'> & Partial<Pick<DailyTask, 'id' | 'done' | 'createdAt'>>) {
  const nextTask = createDailyTask(task)
  const isDuplicate = tasks.some((existing) => {
    if (existing.done) return false
    if (nextTask.weeklyBlockId && existing.weeklyBlockId === nextTask.weeklyBlockId) return true
    if (!nextTask.source || nextTask.source === 'manual') return false
    return existing.source === nextTask.source && existing.title === nextTask.title && existing.subjectCode === nextTask.subjectCode
  })
  return isDuplicate ? tasks : [...tasks, nextTask]
}

function dailyTaskSourceLabel(source?: DailyTask['source']) {
  return {
    manual: 'thủ công',
    exam: 'ôn thi',
    cp: 'CP',
    project: 'project',
    roadmap: 'lộ trình',
  }[source ?? 'manual']
}

function getDailyTaskReason(task: DailyTask, data: AppData) {
  const subject = task.subjectCode ? data.curriculumSubjects.find((item) => item.code === task.subjectCode) : undefined
  const nextExam = task.subjectCode ? getExamEvents(data).find((event) => event.subjectCode === task.subjectCode && getDaysUntil(event.date) >= 0) : undefined
  if (task.source === 'exam' || nextExam) return nextExam ? `Thi gần nhất còn ${getDaysUntil(nextExam.date)} ngày` : 'Việc ôn thi'
  if (task.source === 'cp') return 'Bạn đã đưa CP vào hôm nay'
  if (task.source === 'project') return 'Bạn đã đưa project vào hôm nay'
  if (task.source === 'roadmap') return subject?.riskLevel === 'high' || subject?.riskLevel === 'critical' ? 'Môn rủi ro trong lộ trình' : 'Bạn đưa từ lộ trình'
  if (task.lane === 'GPA') return 'Ưu tiên GPA'
  return 'Việc thủ công hôm nay'
}

function getDailyReviewSummary(data: AppData) {
  const todaySessions = data.studySessions.filter((session) => session.date === today)
  const todayPomodoros = data.pomodoroSessions.filter((session) => getLocalDateKey(new Date(session.completedAt)) === today)
  const focusMinutes = todayPomodoros.length
    ? todayPomodoros.reduce((sum, session) => sum + session.minutes, 0)
    : todaySessions.reduce((sum, session) => sum + session.minutes, 0)
  const openTasks = data.dailyTasks.filter((task) => !task.done)
  const doneTasks = data.dailyTasks.filter((task) => task.done)
  const subjects = uniqueStrings([
    ...todaySessions.map((session) => session.subjectCode).filter(Boolean),
    ...data.dailyTasks.filter((task) => task.done && task.subjectCode).map((task) => task.subjectCode),
  ] as string[])
  const cpTasks = data.dailyTasks.filter((task) => task.source === 'cp').map((task) => task.title)
  const projectTasks = data.dailyTasks.filter((task) => task.source === 'project').map((task) => task.title)
  const carryOverTasks = openTasks.map((task) => task.title)
  const tomorrowSuggestions = getTomorrowSuggestions(data, openTasks)
  return {
    doneTasks: doneTasks.length,
    totalTasks: data.dailyTasks.length,
    openTasks: openTasks.length,
    focusMinutes,
    subjects,
    cpTasks,
    projectTasks,
    carryOverTasks,
    tomorrowSuggestions,
  }
}

function getRecentDailyProgress(data: AppData, days = 7) {
  const reviewsByDate = new globalThis.Map(data.dailyReviews.map((review) => [review.date, review]))
  const todayDate = parseLocalDateKey(today)
  const currentSummary = getDailyReviewSummary(data)
  return Array.from({ length: days }, (_, index) => {
    const date = addDays(todayDate, index - days + 1)
    const dateKey = getLocalDateKey(date)
    const review = reviewsByDate.get(dateKey)
    const doneTasks = review?.doneTasks ?? (dateKey === today ? currentSummary.doneTasks : 0)
    const totalTasks = review?.totalTasks ?? (dateKey === today ? currentSummary.totalTasks : 0)
    const focusMinutes = review?.focusMinutes ?? (dateKey === today ? currentSummary.focusMinutes : 0)
    const subjects = review?.subjects ?? (dateKey === today ? currentSummary.subjects : [])
    const carryOverCount = review?.carryOverTasks.length ?? (dateKey === today ? currentSummary.carryOverTasks.length : 0)
    return {
      date: dateKey,
      doneTasks,
      totalTasks,
      focusMinutes,
      subjects,
      carryOverCount,
      completionPercent: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0,
    }
  })
}

function getSubjectReviewSignals(data: AppData, subjects: CurriculumSubject[]) {
  const recentByCode = new globalThis.Map<string, string>()
  getRecentDailyProgress(data).forEach((review) => {
    review.subjects.forEach((subjectCode) => {
      recentByCode.set(subjectCode, review.date)
    })
  })
  const recent = Array.from(recentByCode.entries())
    .map(([code, lastDate]) => {
      const subject = data.curriculumSubjects.find((item) => item.code === code)
      return subject ? { code, name: subject.name, lastDate } : null
    })
    .filter((item): item is { code: string; name: string; lastDate: string } => Boolean(item))
    .sort((a, b) => b.lastDate.localeCompare(a.lastDate))
    .slice(0, 6)
  const forgotten = subjects
    .filter((subject) => !recentByCode.has(subject.code))
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
    .slice(0, 6)
  return { recent, forgotten }
}

function uniqueSubjects(subjects: CurriculumSubject[]) {
  const byCode = new globalThis.Map<string, CurriculumSubject>()
  subjects.forEach((subject) => byCode.set(subject.code, subject))
  return Array.from(byCode.values())
}

function createDailyReview(data: AppData): DailyReview {
  const summary = getDailyReviewSummary(data)
  const existing = data.dailyReviews.find((review) => review.date === today)
  return {
    id: existing?.id ?? crypto.randomUUID(),
    date: today,
    doneTasks: summary.doneTasks,
    totalTasks: summary.totalTasks,
    focusMinutes: summary.focusMinutes,
    subjects: summary.subjects,
    cpTasks: summary.cpTasks,
    projectTasks: summary.projectTasks,
    carryOverTasks: summary.carryOverTasks,
    tomorrowSuggestions: summary.tomorrowSuggestions,
    savedAt: new Date().toISOString(),
  }
}

function getTomorrowSuggestions(data: AppData, openTasks: DailyTask[]) {
  const suggestions = getRecommendedDailyTasks({ ...data, dailyTasks: openTasks }).slice(0, 3).map((task) => task.title)
  const nextExam = getExamEvents(data).find((event) => getDaysUntil(event.date) >= 0)
  if (nextExam && !suggestions.some((item) => item.includes(nextExam.subjectCode ?? nextExam.title))) {
    suggestions.unshift(`Ôn thi: ${nextExam.subjectCode ?? nextExam.title}`)
  }
  return uniqueStrings(suggestions).slice(0, 3)
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)))
}

function getRecommendedDailyTasks(data: AppData) {
  const exams = getExamEvents(data)
  return data.dailyTasks
    .filter((task) => !task.done)
    .sort((a, b) => getDailyTaskPriority(b, data, exams) - getDailyTaskPriority(a, data, exams))
}

function getDailyTaskPriority(task: DailyTask, data: AppData, exams: FixedEvent[]) {
  const sourceScore = { exam: 120, manual: 60, cp: 50, project: 45, roadmap: 70 }[task.source ?? 'manual']
  const laneScore = task.lane === 'GPA' ? 25 : task.lane === 'CP' ? 10 : 5
  const subject = task.subjectCode ? data.curriculumSubjects.find((item) => item.code === task.subjectCode) : undefined
  const riskScore = subject ? { none: 0, low: 2, watch: 8, high: 16, critical: 24 }[subject.riskLevel] : 0
  const exam = task.subjectCode ? exams.find((event) => event.subjectCode === task.subjectCode && getDaysUntil(event.date) >= 0) : undefined
  const examScore = exam ? Math.max(0, 40 - getDaysUntil(exam.date) * 4) : 0
  const dueScore = task.dueDate === today ? 12 : 0
  return sourceScore + laneScore + riskScore + examScore + dueScore
}

function getExamReviewStatus(event: FixedEvent, data: AppData): 'Chưa ôn' | 'Đang ôn' | 'Ổn' {
  if (!event.subjectCode) return 'Chưa ôn'
  const tasks = data.dailyTasks.filter((task) => task.subjectCode === event.subjectCode && task.lane === 'GPA')
  if (tasks.some((task) => task.done)) return 'Ổn'
  if (tasks.length) return 'Đang ôn'
  return 'Chưa ôn'
}

function examReviewTone(status: ReturnType<typeof getExamReviewStatus>): 'default' | 'success' | 'warning' | 'danger' {
  if (status === 'Ổn') return 'success'
  if (status === 'Đang ôn') return 'warning'
  return 'danger'
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

function targetGradePoint(grade: SemesterSubjectPlan['targetGrade']) {
  return { A: 4, 'B+': 3.5, B: 3, 'C+': 2.5, C: 2 }[grade]
}

function requiredFutureGPA(targetGPA: number, currentGPA: number, completedCredits: number, minimumRequiredCredits: number): number {
  const remainingCredits = minimumRequiredCredits - completedCredits
  if (remainingCredits <= 0) return targetGPA
  const required = (targetGPA * minimumRequiredCredits - currentGPA * completedCredits) / remainingCredits
  return Number(required.toFixed(2))
}

function calculateCreditProgress(completedCredits: number, minimumRequiredCredits: number) {
  return {
    completedCredits,
    minimumRequiredCredits,
    remainingCredits: Math.max(minimumRequiredCredits - completedCredits, 0),
    percent: Number(((completedCredits / minimumRequiredCredits) * 100).toFixed(1)),
  }
}

function inferRiskFromGrade(point4?: number): RiskLevel {
  if (point4 === undefined) return 'none'
  if (point4 < 1.5) return 'critical'
  if (point4 < 2.5) return 'high'
  if (point4 < 3.0) return 'watch'
  if (point4 < 3.5) return 'low'
  return 'none'
}

function inferSubjectImportance(code: string, groupId: string, required: boolean): ImportanceLevel {
  if (['TIN1093', 'TIN1083', 'TIN3083', 'TIN3084', 'TIN4073', 'TIN4623', 'TIN4103', 'TIN4663'].includes(code)) return 'critical'
  if (groupId === 'major' || groupId === 'cs_specialization') return required ? 'critical' : 'high'
  if (groupId === 'foundation') return required ? 'critical' : 'high'
  if (groupId === 'internship' || groupId === 'graduation') return 'critical'
  return required ? 'high' : 'medium'
}

function inferSubjectTags(code: string, name: string, groupId: string): SubjectTag[] {
  const tags = new Set<SubjectTag>(['GPA'])
  const haystack = `${code} ${name}`.toLowerCase()

  if (groupId === 'cs_specialization' || haystack.includes('trí tuệ') || haystack.includes('học máy') || haystack.includes('khai phá') || haystack.includes('ảnh') || haystack.includes('ngôn ngữ tự nhiên')) tags.add('AI')
  if (haystack.includes('toán') || haystack.includes('giải tích') || haystack.includes('xác suất') || haystack.includes('tối ưu') || haystack.includes('rời rạc')) tags.add('MATH')
  if (haystack.includes('lập trình') || haystack.includes('thuật toán') || haystack.includes('cấu trúc dữ liệu') || haystack.includes('độ phức tạp')) tags.add('CP')
  if (haystack.includes('cơ sở dữ liệu') || haystack.includes('hệ quản trị') || haystack.includes('dữ liệu')) tags.add('DATABASE')
  if (haystack.includes('front') || haystack.includes('web')) tags.add('FRONTEND')
  if (haystack.includes('java') || haystack.includes('python') || haystack.includes('thiết kế') || haystack.includes('hệ thống thông tin')) tags.add('SE')
  if (haystack.includes('mạng') || haystack.includes('bảo mật') || haystack.includes('an ninh')) tags.add('NETWORKING')
  if (haystack.includes('kiến trúc') || haystack.includes('hệ điều hành') || haystack.includes('linux') || haystack.includes('ôtômat') || haystack.includes('ngôn ngữ hình thức')) tags.add('SYSTEMS')
  if (groupId === 'major' || groupId === 'foundation' || groupId === 'cs_specialization') tags.add('CS')
  if (groupId === 'internship' || groupId === 'graduation' || haystack.includes('kỹ năng')) tags.add('CAREER')

  return [...tags]
}

function getPriorityScore(subject: CurriculumSubject): number {
  const importanceScore = { low: 1, medium: 2, high: 3, critical: 4 }[subject.importance]
  const riskScore = { none: 0, low: 1, watch: 2, high: 3, critical: 4 }[subject.riskLevel]
  const creditScore = subject.credits >= 4 ? 2 : subject.credits >= 3 ? 1 : 0
  const recoveryScore = subject.recoveryAction === 'none' ? 0 : 2
  return importanceScore * 2 + riskScore * 2 + creditScore + recoveryScore
}

function calculateGroupProgress(group: RequirementGroup, subjects: CurriculumSubject[], selectedSpecializationGroupIds: string[]) {
  const isSelectedSpecialization = group.groupType === 'specialization' && selectedSpecializationGroupIds.includes(group.id)
  const isCounted = group.groupType !== 'specialization' || isSelectedSpecialization
  const requiredCredits = isCounted ? group.minCreditsRequired : 0
  const completedCredits = subjects
    .filter((subject) => subject.groupId === group.id && subject.completionStatus === 'completed')
    .reduce((sum, subject) => sum + subject.credits, 0)
  const percent = requiredCredits > 0 ? Number(((completedCredits / requiredCredits) * 100).toFixed(1)) : 0
  return { completedCredits, requiredCredits, percent, isCounted }
}

function getStats(data: AppData) {
  const calculatedGPA = calculateGPA(data.curriculumSubjects)
  const completedCredits = data.curriculumSubjects
    .filter((subject) => subject.completionStatus === 'completed' && typeof subject.grade?.point4 === 'number')
    .reduce((sum, subject) => sum + subject.credits, 0)
  const currentGPA = calculatedGPA || data.academicProfile.cumulativeGPA4
  const safeCompletedCredits = completedCredits || data.academicProfile.completedCredits
  const creditProgress = calculateCreditProgress(safeCompletedCredits, data.academicProfile.minimumRequiredCredits)
  const riskAlerts = data.curriculumSubjects.filter((subject) => ['watch', 'high', 'critical'].includes(subject.riskLevel))
  return { currentGPA, completedCredits: safeCompletedCredits, creditProgress, riskAlerts }
}

function getGroupName(groupId: string, groups: RequirementGroup[]) {
  return groups.find((group) => group.id === groupId)?.name ?? groupId
}

function riskTone(riskLevel: RiskLevel): 'default' | 'success' | 'warning' | 'danger' {
  if (riskLevel === 'critical' || riskLevel === 'high') return 'danger'
  if (riskLevel === 'watch' || riskLevel === 'low') return 'warning'
  return 'default'
}

function importanceTone(importance: ImportanceLevel): 'default' | 'success' | 'warning' | 'danger' {
  if (importance === 'critical') return 'danger'
  if (importance === 'high') return 'warning'
  if (importance === 'medium') return 'success'
  return 'default'
}

function getWeekStart(date: Date) {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1)
  copy.setDate(diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(date))
}

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min
  return Math.max(min, Math.min(max, value))
}

void inferRiskFromGrade
void Dashboard

export default App
