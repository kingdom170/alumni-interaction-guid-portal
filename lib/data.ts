export const studentsData = [
  {
    id: 1,
    name: "Aditya Kumar",
    email: "aditya@email.com",
    course: "B.Tech CSE",
    image: "👨‍🎓",
    batch: "2025"
  },
  {
    id: 2,
    name: "Priya Nair",
    email: "priya@email.com",
    course: "B.Tech CSE",
    image: "👩‍🎓",
    batch: "2025"
  },
  {
    id: 3,
    name: "Rohit Gupta",
    email: "rohit@email.com",
    course: "B.Tech IT",
    image: "👨‍🎓",
    batch: "2025"
  }
]

export const alumniData = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@techcorp.com",
    profession: "Senior Software Engineer",
    course: "B.Tech - Computer Science",
    field: "Software Development",
    company: "Tech Corp",
    batch: 2018,
    image: "👩‍💼",
  },
  {
    id: 2,
    name: "Arjun Kapoor",
    email: "arjun@financeplus.com",
    profession: "Financial Analyst",
    course: "B.Tech - Electronics",
    field: "Finance & Analysis",
    company: "Finance Plus",
    batch: 2019,
    image: "👨‍💼",
  },
  {
    id: 3,
    name: "Sneha Desai",
    email: "sneha@designstudio.com",
    profession: "UX/UI Designer",
    course: "B.Tech - Mechanical",
    field: "Design & Creativity",
    company: "Design Studio",
    batch: 2020,
    image: "👩‍🎨",
  },
  {
    id: 4,
    name: "Rohit Singh",
    email: "rohit@innovatetech.com",
    profession: "Product Manager",
    course: "B.Tech - Electrical",
    field: "Product Management",
    company: "Innovate Tech",
    batch: 2018,
    image: "👨‍💼",
  },
]

export const eventsData = [
  {
    id: 1,
    title: "Career in AI & Machine Learning",
    description: "Learn about the latest trends in AI/ML and career opportunities in the field",
    date: "Jan 15, 2025",
    time: "6:00 PM",
    organizer: "Priya Sharma & Tech Corp",
    category: "Tech Talk",
  },
  {
    id: 2,
    title: "Startup Journey: From Idea to Success",
    description: "Hear from founders about their journey of building successful startups",
    date: "Jan 22, 2025",
    time: "5:30 PM",
    organizer: "Alumni Founders Network",
    category: "Entrepreneurship",
  },
  {
    id: 3,
    title: "Finance Industry Deep Dive",
    description: "Explore various roles and career paths in the finance sector",
    date: "Jan 28, 2025",
    time: "7:00 PM",
    organizer: "Arjun Kapoor & Finance Plus",
    category: "Finance",
  },
  {
    id: 4,
    title: "Design Thinking Workshop",
    description: "Hands-on workshop on UX/UI design principles and best practices",
    date: "Feb 5, 2025",
    time: "3:00 PM",
    organizer: "Sneha Desai & Design Studio",
    category: "Design",
  },
]

export const jobsData = [
  {
    id: 1,
    title: "Junior Frontend Developer",
    company: "Tech Corp",
    location: "Bangalore, India",
    type: "Full-time",
    eligibility: "B.Tech - All branches, 2024-2025 batch",
    salary: "4-6 LPA",
    postedBy: "Priya Sharma",
    description: "Join our dynamic team to build innovative web applications",
  },
  {
    id: 2,
    title: "Business Analytics Intern",
    company: "Finance Plus",
    location: "Mumbai, India",
    type: "Internship",
    eligibility: "B.Tech - All branches, 2023-2025 batch",
    salary: "₹15,000/month",
    postedBy: "Arjun Kapoor",
    description: "Analyze financial data and support strategic decision-making",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "Delhi, India",
    type: "Full-time",
    eligibility: "B.Tech - CSE, ECE | Portfolio required",
    salary: "3.5-5 LPA",
    postedBy: "Sneha Desai",
    description: "Create beautiful and intuitive user experiences for web and mobile",
  },
  {
    id: 4,
    title: "Data Science Intern",
    company: "Innovate Tech",
    location: "Pune, India",
    type: "Internship",
    eligibility: "B.Tech - CSE, 2024-2025 batch",
    salary: "₹20,000/month",
    postedBy: "Rohit Singh",
    description: "Work with real data and develop machine learning models",
  },
]

export type QueryMessage = {
  id: string
  eventId: number
  studentName: string
  studentEmail: string
  message: string
  timestamp: Date
  replied: boolean
}

export type ChatMessage = {
  id: string
  sender: "user" | "alumni"
  message: string
  timestamp: Date
}

export type Course = {
  id: number
  title: string
  instructor: string
  description: string
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  enrolledCount: number
  rating: number
  category: string
  startDate: string
}

export const eventQueryMessages: QueryMessage[] = []

export const coursesData: Course[] = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    instructor: "Prof. Sharma",
    description: "Learn the basics of HTML, CSS, and JavaScript to build responsive websites",
    duration: "8 weeks",
    level: "Beginner",
    enrolledCount: 245,
    rating: 4.8,
    category: "Web Development",
    startDate: "Jan 20, 2025",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    instructor: "Prof. Kumar",
    description: "Master advanced React concepts including hooks, context, and performance optimization",
    duration: "6 weeks",
    level: "Advanced",
    enrolledCount: 128,
    rating: 4.9,
    category: "Web Development",
    startDate: "Feb 3, 2025",
  },
  {
    id: 3,
    title: "Python for Data Science",
    instructor: "Prof. Verma",
    description: "Learn Python, NumPy, Pandas, and Matplotlib for data analysis and visualization",
    duration: "10 weeks",
    level: "Intermediate",
    enrolledCount: 312,
    rating: 4.7,
    category: "Data Science",
    startDate: "Jan 27, 2025",
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    instructor: "Prof. Singh",
    description: "Understand design thinking, user research, and prototyping for modern products",
    duration: "7 weeks",
    level: "Beginner",
    enrolledCount: 189,
    rating: 4.6,
    category: "Design",
    startDate: "Feb 10, 2025",
  },
  {
    id: 5,
    title: "Machine Learning Fundamentals",
    instructor: "Prof. Patel",
    description: "Introduction to ML algorithms, supervised learning, and model evaluation",
    duration: "12 weeks",
    level: "Intermediate",
    enrolledCount: 198,
    rating: 4.8,
    category: "Machine Learning",
    startDate: "Feb 17, 2025",
  },
  {
    id: 6,
    title: "Mobile App Development with Flutter",
    instructor: "Prof. Gupta",
    description: "Build cross-platform mobile apps using Flutter and Dart",
    duration: "10 weeks",
    level: "Intermediate",
    enrolledCount: 156,
    rating: 4.7,
    category: "Mobile Development",
    startDate: "Mar 3, 2025",
  },
]

export type Feedback = {
  id: string
  itemName: string
  itemType: "alumni" | "course" | "event"
  rating: number
  comment: string
  studentName: string
  date: string
}

export const feedbacksData: Feedback[] = []

export type ResumeData = {
  id: string
  fullName: string
  email: string
  phone: string
  summary: string
  experience: string
  education: string
  skills: string
  certifications?: string
  createdAt: Date
}

export type ResumeReview = {
  id: string
  resumeId: string
  alumniName: string
  rating: number
  feedback: string
  createdAt: Date
}

export const resumeData: ResumeData[] = []
export const resumeReviewsData: ResumeReview[] = []
