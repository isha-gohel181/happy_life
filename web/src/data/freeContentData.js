export const freePdfsData = [
  {
    id: 'pdf-1',
    title: 'Dart Programming Basics & Core Concepts',
    category: 'Flutter & Dart',
    fileSize: '2.5 MB',
    pages: 34,
    downloads: '14.2k',
    rating: 4.9,
    badge: 'Popular',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    description: 'A complete handbook covering Dart variables, null safety, asynchronous programming, streams, and OOP principles for Flutter developers.',
    topics: ['Dart Syntax', 'Null Safety', 'Streams & Futures', 'OOP & Mixins', 'Collections'],
    fileUrl: '/docs/dart-basics.pdf',
    sampleSnippet: `// Dart Null Safety Example
void main() {
  String? nullableName = null;
  String displayName = nullableName ?? 'Guest Developer';
  print('Welcome, \$displayName!');
}`
  },
  {
    id: 'pdf-2',
    title: 'Advanced UI & Layout Architecture in Flutter',
    category: 'Flutter & Dart',
    fileSize: '4.1 MB',
    pages: 52,
    downloads: '9.8k',
    rating: 4.8,
    badge: 'Trending',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    description: 'Master CustomPaint, RenderObjects, responsive layouts, Slivers, and adaptive design principles across Web, iOS, and Android.',
    topics: ['CustomPainter', 'Slivers & CustomScrollView', 'Responsive Builders', 'Adaptive Layouts', 'ShaderMasks'],
    fileUrl: '/docs/advanced-ui.pdf',
    sampleSnippet: `// CustomPainter Structure
class GlowPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFFD99B2A)..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
    canvas.drawCircle(Offset(size.width/2, size.height/2), 24, paint);
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}`
  },
  {
    id: 'pdf-3',
    title: 'Flutter Animations & Micro-Interactions Guide',
    category: 'Flutter & Dart',
    fileSize: '3.2 MB',
    pages: 40,
    downloads: '11.5k',
    rating: 5.0,
    badge: 'Featured',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    description: 'Comprehensive guide to Implicit Animations, AnimationControllers, Hero widgets, Rive integration, and physics-based simulations.',
    topics: ['AnimationController', 'CurvedAnimation', 'Hero Transitions', 'TweenAnimationBuilder', 'Physics Simulations'],
    fileUrl: '/docs/flutter-animations.pdf',
    sampleSnippet: `// AnimatedBuilder Controller
late AnimationController _controller;
late Animation<double> _scaleAnimation;
@override
void initState() {
  super.initState();
  _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 600));
  _scaleAnimation = CurvedAnimation(parent: _controller, curve: Curves.easeOutBack);
}`
  },
  {
    id: 'pdf-4',
    title: 'REST API & State Architecture Integration',
    category: 'Backend & APIs',
    fileSize: '1.8 MB',
    pages: 28,
    downloads: '8.4k',
    rating: 4.7,
    badge: 'Essential',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    description: 'Production-ready guide for structuring Dio/Http clients, token refresh interceptors, error handling, and clean repository pattern.',
    topics: ['Dio Interceptors', 'Repository Pattern', 'JSON Serialization', 'WebSocket Channels', 'Offline Caching'],
    fileUrl: '/docs/rest-api-guide.pdf',
    sampleSnippet: `// Dio Auth Interceptor
dio.interceptors.add(InterceptorsWrapper(
  onRequest: (options, handler) {
    options.headers['Authorization'] = 'Bearer \$token';
    return handler.next(options);
  }
));`
  },
  {
    id: 'pdf-5',
    title: 'React 19 & Next.js Fullstack Cheatsheet',
    category: 'Web Development',
    fileSize: '5.0 MB',
    pages: 64,
    downloads: '18.9k',
    rating: 4.9,
    badge: 'Top Rated',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    description: 'Deep dive into React Server Components, Server Actions, suspense streaming, modern hooks, and Tailwind CSS v4 design architecture.',
    topics: ['Server Components (RSC)', 'Server Actions', 'useOptimistic Hook', 'Streaming SSR', 'Zustand & Redux Toolkit'],
    fileUrl: '/docs/react-next-cheatsheet.pdf',
    sampleSnippet: `// React Server Action
export async function createPost(formData) {
  'use server'
  const title = formData.get('title');
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
}`
  },
  {
    id: 'pdf-6',
    title: 'System Design & High-Scalability Blueprint',
    category: 'Architecture',
    fileSize: '3.8 MB',
    pages: 45,
    downloads: '13.1k',
    rating: 4.9,
    badge: 'Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    description: 'Visual system design patterns covering Load Balancers, Redis caching, Message Queues (Kafka/RabbitMQ), and database sharding.',
    topics: ['Microservices', 'Redis & Memcached', 'Kafka Event Streaming', 'Database Sharding', 'CDN & Edge Caching'],
    fileUrl: '/docs/system-design.pdf',
    sampleSnippet: `// Cache-Aside Pattern
async function getCachedData(key) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const fresh = await db.query(key);
  await redis.set(key, JSON.stringify(fresh), 'EX', 3600);
  return fresh;
}`
  }
];

export const freeClassesData = [
  {
    id: 'class-1',
    title: 'Introduction to Flutter & Mobile Architecture',
    category: 'Flutter & Dart',
    duration: '45 mins',
    level: 'Beginner',
    instructor: 'Alex Mercer',
    role: 'Staff Flutter Engineer',
    rating: 4.9,
    views: '24.5k',
    badge: 'Free Lecture',
    videoUrl: 'https://www.youtube.com/embed/1gDhl4leEzA',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    description: 'Understand the core anatomy of Flutter, how the widget tree, element tree, and render object tree cooperate to achieve 120 FPS performance.',
    takeaways: [
      'Understand Widget, Element, and RenderObject lifecycle',
      'Stateless vs Stateful widget internal rendering',
      'Configuring developer environment and hot reload pipelines',
      'Structuring scalable project directory layouts'
    ]
  },
  {
    id: 'class-2',
    title: 'State Management in Flutter: Bloc vs Riverpod',
    category: 'Flutter & Dart',
    duration: '1 hr 15 mins',
    level: 'Intermediate',
    instructor: 'Devon Vance',
    role: 'Principal Architect',
    rating: 5.0,
    views: '32.1k',
    badge: 'Masterclass',
    videoUrl: 'https://www.youtube.com/embed/5F-6n_tJpPE',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    description: 'An architectural breakdown comparing Bloc pattern and Riverpod 2.0 with practical code implementation for enterprise production apps.',
    takeaways: [
      'Event-driven state machines using Bloc & Cubit',
      'NotifierProvider, AsyncNotifier & code-gen with Riverpod',
      'Dependency Injection & clean testing architecture',
      'Handling asynchronous loading, errors, and optimistic mutations'
    ]
  },
  {
    id: 'class-3',
    title: 'Building Responsive & Adaptive Modern UIs',
    category: 'UI/UX & Frontend',
    duration: '50 mins',
    level: 'Beginner to Intermediate',
    instructor: 'Sarah Jenkins',
    role: 'Lead Design Engineer',
    rating: 4.8,
    views: '19.4k',
    badge: 'Popular',
    videoUrl: 'https://www.youtube.com/embed/g2f_X14603I',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    description: 'Learn how to construct interfaces that dynamically adapt between mobile viewports, tablets, and desktop ultra-wide displays seamlessly.',
    takeaways: [
      'LayoutBuilder, MediaQuery, and Breakpoint best practices',
      'Fluid typography and proportional sizing formulas',
      'Keyboard navigation and mouse hover states',
      'Glassmorphism, dark/light themes, and custom shaders'
    ]
  },
  {
    id: 'class-4',
    title: 'Firebase Integration & Realtime Sync',
    category: 'Backend & Cloud',
    duration: '1 hr 30 mins',
    level: 'Intermediate',
    instructor: 'Elena Rostova',
    role: 'Cloud Solutions Specialist',
    rating: 4.9,
    views: '28.7k',
    badge: 'Hands-on Workshop',
    videoUrl: 'https://www.youtube.com/embed/sfA3NWDBPZ8',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    description: 'Step-by-step masterclass covering Firestore database schemas, Firebase Cloud Messaging push notifications, and OAuth authentication flows.',
    takeaways: [
      'Setting up Firebase CLI, rules, and security policies',
      'Realtime snapshot listeners and offline persistence',
      'Push notification payload handlers and background workers',
      'Cloud Functions triggers and secure serverless endpoints'
    ]
  },
  {
    id: 'class-5',
    title: 'Modern Full-Stack API Architecture with Node.js',
    category: 'Backend & APIs',
    duration: '1 hr 10 mins',
    level: 'Advanced',
    instructor: 'Marcus Aurelius',
    role: 'Backend Tech Lead',
    rating: 4.9,
    views: '21.3k',
    badge: 'Deep Dive',
    videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    description: 'Construct scalable RESTful and GraphQL endpoints utilizing Node.js, Express, MongoDB/PostgreSQL, JWT token rotation, and rate limiting.',
    takeaways: [
      'Layered controller-service-repository pattern',
      'JWT access token & HTTP-only refresh cookie flow',
      'Input validation using Zod and sanitization',
      'Dockerizing Node microservices for production'
    ]
  },
  {
    id: 'class-6',
    title: 'Mastering JavaScript ES2024 & Async Patterns',
    category: 'Web Development',
    duration: '55 mins',
    level: 'All Levels',
    instructor: 'Chloe Bennett',
    role: 'Senior Web Specialist',
    rating: 5.0,
    views: '35.8k',
    badge: 'Essential',
    videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80',
    description: 'Unlock modern JS superpowers: Promise.allSettled, Top-level Await, Closures, Event Loop mechanics, and performance memory profiling.',
    takeaways: [
      'Event Loop, Microtasks vs Macrotasks deep dive',
      'Memory leaks identification in DevTools',
      'Functional array methods and immutable state transformations',
      'Web Workers and background thread computations'
    ]
  }
];

export const freeTestsData = [
  {
    id: 'test-1',
    title: 'Weekly Practice Quiz 1: Core Fundamentals',
    category: 'General Assessment',
    questionsCount: 20,
    durationMinutes: 25,
    difficulty: 'Easy to Medium',
    rating: 4.9,
    attempts: '16.4k',
    badge: 'Weekly Quiz',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    description: 'Test your grasp of core programming logic, data types, asynchronous execution, and standard computer science principles.',
    questions: [
      {
        question: 'Which Dart feature prevents variables from holding null values unless explicitly declared?',
        options: ['Late Binding', 'Sound Null Safety', 'Dynamic Dispatch', 'Static Polymorphism'],
        correctIndex: 1,
        explanation: 'Sound Null Safety in Dart ensures that variables cannot contain null unless explicitly marked with a question mark (e.g., String?).'
      },
      {
        question: 'In Flutter, which tree is responsible for computing geometry and handling layout painting?',
        options: ['Widget Tree', 'Element Tree', 'RenderObject Tree', 'State Tree'],
        correctIndex: 2,
        explanation: 'The RenderObject Tree holds objects that handle layout, sizing, painting, and hit testing on the screen.'
      },
      {
        question: 'What is the primary advantage of using const constructors in Flutter widgets?',
        options: [
          'They compile to C++ binary directly',
          'Flutter can reuse existing instances without rebuilding or reallocating memory',
          'They automatically enable multi-threading',
          'They force the widget to re-render every frame'
        ],
        correctIndex: 1,
        explanation: 'When a widget is instantiated as const, Flutter reuses the canonical instance across rebuilds, optimizing memory and rendering performance.'
      },
      {
        question: 'In JavaScript, which array method returns a new array with all elements that pass the provided test?',
        options: ['map()', 'filter()', 'reduce()', 'some()'],
        correctIndex: 1,
        explanation: 'filter() creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test.'
      },
      {
        question: 'What does the HTTP 401 status code signify?',
        options: ['Forbidden (No permissions)', 'Unauthorized (Authentication required)', 'Resource Not Found', 'Internal Server Error'],
        correctIndex: 1,
        explanation: 'HTTP 401 Unauthorized indicates that the request lacks valid authentication credentials for the target resource.'
      }
    ]
  },
  {
    id: 'test-2',
    title: 'Flutter Basics & Widget Tree Proficiency Test',
    category: 'Flutter & Dart',
    questionsCount: 30,
    durationMinutes: 30,
    difficulty: 'Intermediate',
    rating: 4.8,
    attempts: '12.8k',
    badge: 'Certification Prep',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    description: 'Assess your knowledge on BuildContext, Keys (ValueKey, GlobalKey), InheritedWidget, and lifecycle methods like didUpdateWidget.',
    questions: [
      {
        question: 'When is the didUpdateWidget() lifecycle method called in a StatefulWidget?',
        options: [
          'Only once when the widget is first inserted into the tree',
          'Whenever the parent widget rebuilds and provides new configuration properties to this widget',
          'Right before the widget state is permanently destroyed',
          'When the user clicks on the screen'
        ],
        correctIndex: 1,
        explanation: 'didUpdateWidget() is invoked whenever the widget configuration changes, allowing the State object to respond to new parameters from the parent.'
      },
      {
        question: 'What kind of Key should you use if you need to preserve state across different locations in the widget tree?',
        options: ['LocalKey', 'ValueKey', 'GlobalKey', 'ObjectKey'],
        correctIndex: 2,
        explanation: 'A GlobalKey uniquely identifies an element across the entire application and allows reparenting an element without losing its state.'
      },
      {
        question: 'What widget is used to execute asynchronous computations and rebuild UI as the state transitions?',
        options: ['FutureBuilder', 'Column', 'Stack', 'Transform'],
        correctIndex: 0,
        explanation: 'FutureBuilder connects to a Future and rebuilds its UI using an AsyncSnapshot whenever the Future completes or fails.'
      },
      {
        question: 'What is the purpose of the Expanded widget inside a Row or Column?',
        options: [
          'It shrinks the child to zero size',
          'It forces the child to fill the available space along the main axis',
          'It rotates the child widget by 90 degrees',
          'It adds a drop shadow around the child'
        ],
        correctIndex: 1,
        explanation: 'Expanded expands a child of a Row, Column, or Flex so that the child fills the available space along the main axis according to its flex factor.'
      }
    ]
  },
  {
    id: 'test-3',
    title: 'Dart Advanced Types, Streams & Async Quiz',
    category: 'Flutter & Dart',
    questionsCount: 15,
    durationMinutes: 20,
    difficulty: 'Advanced',
    rating: 5.0,
    attempts: '9.2k',
    badge: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    description: 'Challenging questions testing Isolates, Microtasks, StreamTransformers, Generics, and Mixin linearizations in Dart.',
    questions: [
      {
        question: 'How do Dart Isolates communicate with each other?',
        options: [
          'Through shared memory pointers',
          'Through SendPort and ReceivePort message passing',
          'Via local SQLite database tables',
          'Isolates cannot communicate under any circumstances'
        ],
        correctIndex: 1,
        explanation: 'Isolates do not share memory; they communicate exclusively by passing messages across SendPort and ReceivePort channels.'
      },
      {
        question: 'What happens when you use the yield* keyword inside an async* generator function in Dart?',
        options: [
          'It terminates the generator function immediately',
          'It delegates emission to another Stream or Iterable',
          'It causes a compile-time syntax error',
          'It freezes the UI thread for 5 seconds'
        ],
        correctIndex: 1,
        explanation: 'yield* yields all the elements from an existing Stream or Iterable into the current generator sequence.'
      },
      {
        question: 'What is the execution order difference between scheduleMicrotask() and Future() in Dart?',
        options: [
          'Future executes before microtasks',
          'Microtask queue executes before the event queue (where Futures reside)',
          'They execute synchronously on parallel CPU threads',
          'They always execute at the exact same millisecond'
        ],
        correctIndex: 1,
        explanation: 'Dart prioritizes the Microtask queue over the Event queue; any scheduled microtasks run before the next event in the event loop is processed.'
      }
    ]
  },
  {
    id: 'test-4',
    title: 'Full-Stack Mock Technical Interview & System Design Test',
    category: 'Full-Stack & System Design',
    questionsCount: 50,
    durationMinutes: 45,
    difficulty: 'Hard',
    rating: 4.9,
    attempts: '7.5k',
    badge: 'Pro Mock Exam',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    description: 'Realistic technical interview questions on database indexing, CAP theorem, caching strategies, rate limit algorithms, and API security.',
    questions: [
      {
        question: 'According to the CAP Theorem, what are the three properties of a distributed data system?',
        options: [
          'Consistency, Availability, Partition Tolerance',
          'Concurrency, Atomicity, Performance',
          'Compression, Agility, Persistence',
          'Caching, Authentication, Provisioning'
        ],
        correctIndex: 0,
        explanation: 'The CAP theorem states that any distributed data store can only provide two of the following three guarantees: Consistency, Availability, and Partition Tolerance.'
      },
      {
        question: 'Which rate-limiting algorithm uses a fixed-capacity container that fills with tokens at a constant rate?',
        options: ['Sliding Window Counter', 'Token Bucket Algorithm', 'Leaky Bucket Algorithm', 'Round Robin'],
        correctIndex: 1,
        explanation: 'The Token Bucket algorithm adds tokens to a bucket at a fixed rate, and incoming requests consume tokens to be processed.'
      },
      {
        question: 'What is database index B-Tree primarily optimized for compared to a Hash Index?',
        options: [
          'Exact key lookups only',
          'Range queries and sorted traversals (e.g. BETWEEN, > , <)',
          'Compressing image files',
          'Encrypting passwords with SHA-256'
        ],
        correctIndex: 1,
        explanation: 'B-Tree indexes maintain sorted keys, making them exceptionally efficient for range scans, sorting, and comparison operators.'
      },
      {
        question: 'What is the primary vulnerability prevented by using parameterized database queries (Prepared Statements)?',
        options: ['Cross-Site Scripting (XSS)', 'SQL Injection (SQLi)', 'Distributed Denial of Service (DDoS)', 'Buffer Overflow'],
        correctIndex: 1,
        explanation: 'Prepared statements treat user input strictly as literal data rather than executable code, preventing SQL injection exploits.'
      }
    ]
  }
];

export const freeContentCategories = [
  'All',
  'Flutter & Dart',
  'Web Development',
  'Backend & APIs',
  'Architecture',
  'UI/UX & Frontend',
  'General Assessment'
];
