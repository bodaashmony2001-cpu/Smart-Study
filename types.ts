
export type Language = 'en' | 'ar';

export interface Meta {
  topic_title: string;
  reading_time: string;
  difficulty_level: 'Easy' | 'Medium' | 'Hard';
}

export interface Summary {
  content: string; // Renamed from arabic_content to support generic languages (AR, EN)
  english_keywords: string[];
}

export interface Flashcard {
  id: number;
  front_text: string;
  back_text: string;
  type: 'definition' | 'formula' | 'process';
}

export interface VisualConcept {
  id: number;
  label: string;
  description: string;
  shape: 'circle' | 'rect' | 'hexagon' | 'star';
  importance: number; // 1-10
  color: string;
}

export interface VisualForgeData {
  concepts: VisualConcept[];
  connections: { from: number; to: number }[];
}

export interface MindMapBranch {
  title: string;
  icon: string;
  color_code: string;
  key_points: string[];
}

export interface MindMapData {
  root_node: string;
  branches: MindMapBranch[];
}

export interface QuizData {
  question: string;
  options: string[];
  correct_option: string;
}

export interface SpacedRepetitionTask {
  day_offset: number;
  notification_title: string;
  activity_type: string;
  question: string;
  quiz_data?: QuizData;
}

export interface AcademicAsset {
  meta: Meta;
  summary: Summary;
  flashcards: Flashcard[];
  mind_map_data: MindMapData;
  spaced_repetition_schedule: SpacedRepetitionTask[];
  visual_forge?: VisualForgeData;
  chatbot_persona_context: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface StudySession {
  id: string;
  fileName: string;
  pageRange: string;
  asset: AcademicAsset;
  illustrations: string[];
  chatHistory: ChatMessage[];
  timestamp: number;
}

export interface User {
  email: string;
  name: string;
}
