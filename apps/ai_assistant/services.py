"""
AI Service using Google Gemini API
Handles chat, analysis, and image processing
"""
import os
import time
import google.generativeai as genai
from PIL import Image
from django.conf import settings


class GeminiAIService:
    """Google Gemini AI Service"""
    
    def __init__(self):
        api_key = os.getenv('GOOGLE_AI_API_KEY')
        if not api_key:
            # Try using config from decouple as fallback
            try:
                from decouple import config
                api_key = config('GOOGLE_AI_API_KEY', default='')
            except:
                pass
        
        if not api_key:
            raise ValueError("GOOGLE_AI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        # Use Gemini 2.5 Flash - stable version from June 2025
        self.text_model = genai.GenerativeModel('gemini-2.5-flash')
        self.vision_model = genai.GenerativeModel('gemini-2.5-flash')  # Supports multimodal
    
    def chat(self, message, context=None):
        """
        AI chat for general questions
        
        Args:
            message: User's message (may include language instruction)
            context: Optional context about the user (dict)
        
        Returns:
            tuple: (response_text, response_time)
        """
        start_time = time.time()
        
        # Detect language instruction
        language_instruction = ""
        if "[Respond in Hindi]" in message:
            language_instruction = "\n\nIMPORTANT: Respond ONLY in Hindi (Devanagari script). Use Hindi for all explanations."
            message = message.replace("[Respond in Hindi]", "").strip()
        elif "[Respond in Hinglish" in message:
            language_instruction = "\n\nIMPORTANT: Respond in Hinglish (mix of Hindi and English). Use Roman script for Hindi words mixed with English. Example: 'Aapko study karne ke liye proper time management chahiye.'"
            message = message.replace("[Respond in Hinglish (mix of Hindi and English)]", "").strip()
        
        # Build system prompt with context
        system_prompt = """You are Nova AI, a helpful AI study assistant for library students in India.
        You help students with:
        - Study tips and techniques
        - Time management
        - Motivation and encouragement
        - Exam preparation strategies
        - Subject-specific guidance
        
        Keep responses:
        - Concise and actionable (2-3 paragraphs max)
        - Encouraging and positive
        - Practical and specific
        - Culturally appropriate for Indian students
        
        FORMATTING RULES:
        - Use **bold** for important points
        - Use bullet points (-) for lists
        - Use numbered lists (1., 2., 3.) for steps
        - Add line breaks between paragraphs
        - Use proper spacing for readability
        """
        
        system_prompt += language_instruction
        
        if context:
            context_str = "\n\n=== USER CONTEXT & DATABASE ACCESS ===\n"
            
            # App features
            if context.get('app_features'):
                context_str += f"\n{context['app_features']}\n"
            
            # User type and basic info
            context_str += f"\nUser Type: {context.get('user_type', 'unknown')}\n"
            context_str += f"User Role: {context.get('user_role', 'unknown')}\n"
            
            if context.get('user_type') == 'student':
                context_str += f"\n**STUDENT INFORMATION:**\n"
                context_str += f"- Name: {context.get('full_name', 'N/A')}\n"
                context_str += f"- Student ID: {context.get('student_id', 'N/A')}\n"
                context_str += f"- Library: {context.get('library_name', 'N/A')} ({context.get('library_id', 'N/A')})\n"
                context_str += f"- Preparing for: {context.get('preparing_for', 'N/A')}\n"
                context_str += f"- Education Level: {context.get('education_level', 'N/A')}\n"
                context_str += f"- Assigned Seat: {context.get('assigned_seat', 'Not assigned')}\n"
                context_str += f"- Subscription Status: {context.get('subscription_status', 'N/A')}\n"
                
                context_str += f"\n**CURRENT ACTIVITY:**\n"
                context_str += f"- Study Hours Today: {context.get('study_hours_today', 0)} hours\n"
                context_str += f"- Study Sessions This Week: {context.get('study_sessions_this_week', 0)}\n"
                context_str += f"- Pending Tasks: {context.get('pending_tasks', 0)}\n"
                context_str += f"- Completed Tasks: {context.get('completed_tasks', 0)}\n"
                context_str += f"- Total Notes: {context.get('total_notes', 0)}\n"
                context_str += f"- Active Goals: {context.get('active_goals', 0)}\n"
                
                if context.get('performance_metrics'):
                    metrics = context['performance_metrics']
                    context_str += f"\n**PERFORMANCE METRICS (Last 30 Days):**\n"
                    context_str += f"- Attendance Rate: {metrics.get('attendance_rate', 0)}%\n"
                    context_str += f"- Total Study Sessions: {metrics.get('total_sessions', 0)}\n"
                    context_str += f"- Average Session Duration: {metrics.get('avg_duration', 0)} hours\n"
                    context_str += f"- Task Completion Rate: {metrics.get('task_completion', 0)}%\n"
                    context_str += f"- Active Days: {metrics.get('active_days', 0)}/30\n"
            
            elif context.get('user_type') == 'library_owner':
                context_str += f"\n**LIBRARY INFORMATION:**\n"
                context_str += f"- Library Name: {context.get('library_name', 'N/A')}\n"
                context_str += f"- Library ID: {context.get('library_id', 'N/A')}\n"
                context_str += f"- Total Seats: {context.get('total_seats', 0)}\n"
                context_str += f"- Opening Time: {context.get('opening_time', 'N/A')}\n"
                context_str += f"- Closing Time: {context.get('closing_time', 'N/A')}\n"
                context_str += f"- Today's Attendance: {context.get('today_attendance', 0)} students\n"
                context_str += f"- Pending Notifications: {context.get('pending_notifications', 0)}\n"
                context_str += f"- Subscriptions Expiring Soon: {context.get('subscriptions_expiring_soon', 0)}\n"
                
                if context.get('business_metrics'):
                    metrics = context['business_metrics']
                    context_str += f"\n**BUSINESS METRICS:**\n"
                    context_str += f"- Total Students: {metrics.get('total_students', 0)}\n"
                    context_str += f"- Active Students: {metrics.get('active_students', 0)}\n"
                    context_str += f"- New Students This Month: {metrics.get('new_students', 0)}\n"
                    context_str += f"- Monthly Revenue: ₹{metrics.get('monthly_revenue', 0):,}\n"
                    context_str += f"- Seat Occupancy Rate: {metrics.get('occupancy_rate', 0)}%\n"
                    context_str += f"- Average Attendance: {metrics.get('avg_attendance', 0)}%\n"
                    context_str += f"- Student Retention Rate: {metrics.get('retention_rate', 0)}%\n"
                    context_str += f"- Occupied Seats: {metrics.get('occupied_seats', 0)}/{metrics.get('total_seats', 0)}\n"
            
            context_str += "\n=== END CONTEXT ===\n"
            context_str += "\nYou have access to all this data. Use it to provide specific, personalized, and data-driven responses.\n"
            system_prompt += context_str
        
        full_prompt = f"{system_prompt}\n\nQuestion: {message}\n\nYour Response:"
        
        try:
            response = self.text_model.generate_content(full_prompt)
            response_time = time.time() - start_time
            return response.text, response_time
        except Exception as e:
            response_time = time.time() - start_time
            return f"I apologize, but I encountered an error: {str(e)}", response_time
    
    def analyze_performance(self, student_data):
        """
        Analyze student performance and provide insights
        
        Args:
            student_data: Dict with attendance_rate, total_sessions, task_completion, etc.
        
        Returns:
            tuple: (analysis_text, response_time)
        """
        start_time = time.time()
        
        prompt = f"""Analyze this student's study performance and provide actionable insights:

📊 Performance Metrics:
- Attendance Rate: {student_data.get('attendance_rate', 0)}%
- Total Study Sessions: {student_data.get('total_sessions', 0)}
- Average Session Duration: {student_data.get('avg_duration', 0)} hours
- Task Completion Rate: {student_data.get('task_completion', 0)}%
- Active Days: {student_data.get('active_days', 0)} out of 30

Provide a well-formatted analysis with:

## Overall Performance Assessment
(1-2 sentences)

## Strengths
- Point 1
- Point 2
- Point 3

## Areas for Improvement
- Point 1
- Point 2
- Point 3

## Actionable Recommendations
1. Specific action 1
2. Specific action 2
3. Specific action 3
4. Specific action 4

## Motivational Message
(1 encouraging sentence)

Use **bold** for emphasis and proper markdown formatting. Keep it concise and actionable."""
        
        try:
            response = self.text_model.generate_content(prompt)
            response_time = time.time() - start_time
            return response.text, response_time
        except Exception as e:
            response_time = time.time() - start_time
            return f"Analysis unavailable: {str(e)}", response_time
    
    def generate_study_plan(self, student_profile):
        """
        Generate personalized study plan
        
        Args:
            student_profile: Dict with exam info, subjects, available hours
        
        Returns:
            tuple: (study_plan_text, response_time)
        """
        start_time = time.time()
        
        prompt = f"""Create a detailed study plan for this student:

🎯 Student Profile:
- Preparing for: {student_profile.get('preparing_for', 'Competitive Exam')}
- Exam Date: {student_profile.get('exam_date', 'Not specified')}
- Available Hours per Day: {student_profile.get('hours_per_day', 8)}
- Subjects: {', '.join(student_profile.get('subjects', ['Not specified']))}
- Weak Areas: {', '.join(student_profile.get('weak_subjects', ['None specified']))}
- Current Level: {student_profile.get('education_level', 'Not specified')}

Create a structured study plan with:
1. Weekly Schedule (breakdown by day)
2. Subject-wise Time Allocation
3. Break Times and Rest Days
4. Revision Strategy
5. Mock Test Schedule
6. Tips for Weak Areas

Keep it practical and achievable."""
        
        try:
            response = self.text_model.generate_content(prompt)
            response_time = time.time() - start_time
            return response.text, response_time
        except Exception as e:
            response_time = time.time() - start_time
            return f"Study plan generation failed: {str(e)}", response_time
    
    def summarize_notes(self, notes_text, note_title=""):
        """
        Summarize student notes
        
        Args:
            notes_text: The notes content
            note_title: Optional title of the notes
        
        Returns:
            tuple: (summary_text, response_time)
        """
        start_time = time.time()
        
        title_str = f"Title: {note_title}\n\n" if note_title else ""
        
        prompt = f"""Summarize these study notes concisely and effectively:

{title_str}Notes Content:
{notes_text[:3000]}  # Limit to avoid token limits

Provide:
1. Key Points (5-7 bullet points)
2. Important Concepts (2-3 main ideas)
3. Formulas/Definitions (if any)
4. Suggested Practice Questions (2-3)

Keep it clear and study-friendly."""
        
        try:
            response = self.text_model.generate_content(prompt)
            response_time = time.time() - start_time
            return response.text, response_time
        except Exception as e:
            response_time = time.time() - start_time
            return f"Summarization failed: {str(e)}", response_time
    
    def analyze_business_metrics(self, library_data):
        """
        Analyze library business metrics for owners
        
        Args:
            library_data: Dict with business metrics
        
        Returns:
            tuple: (insights_text, response_time)
        """
        start_time = time.time()
        
        prompt = f"""Analyze this library's business performance and provide strategic insights:

📊 Library Metrics:
- Total Students: {library_data.get('total_students', 0)}
- Active Students: {library_data.get('active_students', 0)}
- Monthly Revenue: ₹{library_data.get('monthly_revenue', 0):,}
- Seat Occupancy Rate: {library_data.get('occupancy_rate', 0)}%
- Average Attendance: {library_data.get('avg_attendance', 0)}%
- New Students This Month: {library_data.get('new_students', 0)}
- Student Retention Rate: {library_data.get('retention_rate', 0)}%

Provide a well-formatted analysis with:

## Business Health Assessment
(2-3 sentences overview)

## Key Strengths
- Strength 1
- Strength 2
- Strength 3

## Areas of Concern
- Concern 1
- Concern 2
- Concern 3

## Revenue Predictions (Next 3 Months)
Brief prediction with reasoning

## Growth Opportunities
1. Opportunity 1 with action steps
2. Opportunity 2 with action steps
3. Opportunity 3 with action steps
4. Opportunity 4 with action steps

## Risk Factors to Monitor
- Risk 1
- Risk 2
- Risk 3

## Specific Recommendations
1. Action item 1
2. Action item 2
3. Action item 3
4. Action item 4
5. Action item 5

Use **bold** for emphasis and proper markdown formatting. Be specific, data-driven, and actionable."""
        
        try:
            response = self.text_model.generate_content(prompt)
            response_time = time.time() - start_time
            return response.text, response_time
        except Exception as e:
            response_time = time.time() - start_time
            return f"Business analysis failed: {str(e)}", response_time
    
    def analyze_image(self, image_path, prompt="Describe this image"):
        """
        Analyze image using Gemini Pro Vision
        
        Args:
            image_path: Path to image file
            prompt: What to analyze in the image
        
        Returns:
            tuple: (analysis_text, response_time)
        """
        start_time = time.time()
        
        try:
            image = Image.open(image_path)
            response = self.vision_model.generate_content([prompt, image])
            response_time = time.time() - start_time
            return response.text, response_time
        except Exception as e:
            response_time = time.time() - start_time
            return f"Image analysis failed: {str(e)}", response_time
    
    def extract_text_from_image(self, image_path):
        """
        Extract text from image (OCR)
        
        Args:
            image_path: Path to image file
        
        Returns:
            tuple: (extracted_text, response_time)
        """
        prompt = """Extract all text from this image. 
        If it's handwritten, do your best to read it accurately.
        Return only the extracted text, maintaining the original structure."""
        
        return self.analyze_image(image_path, prompt)


# Singleton instance
_ai_service = None

def get_ai_service():
    """Get or create AI service instance"""
    global _ai_service
    if _ai_service is None:
        _ai_service = GeminiAIService()
    return _ai_service
