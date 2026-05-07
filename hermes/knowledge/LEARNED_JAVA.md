# Java Learning (dev.java)

## Overview
Oracle's official Java learning hub for developers.

---

## Getting Started
- Downloading/setting up JDK
- Writing first Java class
- Creating first application
- JShell (REPL - Read-Eval-Print Loop)
- VS Code with Java
- IntelliJ IDEA
- Eclipse IDE

## Language Basics
- Objects, Classes, Interfaces, Packages
- Java Language Basics
- Classes and Objects
- **Records** - immutable data modeling
- Numbers and Strings
- Inheritance
- Interfaces
- **Generics**
- **Lambda Expressions**
- **Annotations**
- Packages
- **Pattern Matching**
- Exceptions
- Refactoring (Imperative → Functional)

## API Mastery
- **Collections Framework** - Lists, Maps, HashMaps
- **Stream API** - parallel streams
- **Java I/O API** - file access
- **Common I/O Tasks** - web apps (files, JSON, images)
- **Date Time API** - JDK 8+
- **Regular Expressions**
- **Java Reflection** - runtime inspection
- **Method Handles**
- **Virtual Threads** - NEW
- **Foreign Function and Memory API (FFM)**

## Application Organization
- **Modules** - JDK module system
- **JLink** - custom runtime images

## JVM & Tools
- Core JDK Tools
- Monitoring Tools
- **JPackage** - native installers
- Security Tools
- Troubleshooting Tools
- **Garbage Collection** tuning
- **CDS and AppCDS** - startup performance
- **JDK Flight Recorder** - profiling
- **JWebserver** - minimal HTTP server

## Rich Client Apps
- **JavaFX** - GUI applications
- JavaFX animations

---

## Resources
- dev.java/learn/

---

## Version-Specific Considerations

### Java 8 (LTS)
- Classic language features
- Streams, lambdas
- Optional
- Date/time API
- Widely-supported tooling

### Java 11+ (LTS)
- Modules (JPMS)
- Newer APIs
- HttpClient
- Flight Recorder basics

### Java 17+ / 21 (LTS)
- Sealed classes
- Pattern matching (preview)
- Record types
- Enhanced switch
- Performance improvements

---

## OpenJDK Source
- Source Browser: hg.openjdk.java.net
- Navigate to specific project repositories

---

## Self-Learning Plan (Hands-On)

### 1. Pick Target Version (e.g., Java 17 LTS)

### 2. Core Language & API (2-3 weeks)
- Language basics
- Collections
- Streams
- I/O
- Practice: Small projects (data structure, REST client)

### 3. JVM & Performance (1-2 weeks)
- JVM Tuning Guide
- Flight Recorder
- Practice: Different GC settings, jvisualvm/jfr

### 4. Build Tools (1-2 weeks)
- Gradle or Maven
- Practice: Multi-module project, dependencies, build pipelines

### 5. Real-World Patterns (Ongoing)
- Spring docs or framework
- Practice: Small service with DI, config, tests

### 6. Deep Dives (As Needed)
- Concurrency
- NIO
- Networking
- Security basics
- Reflection
- Modules (JPMS)

---

## Additional Resources (Extended)

### Official Documentation
- Oracle JDK Docs: docs.oracle.com/en/java/
- Java SE API Spec: docs.oracle.com/en/java/javase/
- JDK Release Notes: oracle.com/java/technologies/javase/roadmap.html

### Language & API
- Oracle Java Tutorials: docs.oracle.com/javase/tutorial/
- Java Language Spec: docs.oracle.com/javase/specs/jls/se8/html/
- API Docs: docs.oracle.com/javase/8/docs/api/

### Build Tools
- Maven Surefire: maven.apache.org/surefire/maven-surefire-plugin/
- Gradle User Manual: docs.gradle.org/current/userguide/userguide.html

### Framework
- Spring Framework: docs.spring.io/spring-framework/docs/current/reference/

### Practical Guides
- Baeldung: baeldung.com/
- InfoQ: infoq.com/java/
- OpenJDK Blog: openjdk.java.net/blog/

### Interactive Learning
- LeetCode: leetcode.com (Java track)
- HackerRank: hackerrank.com/domains/tutorials/10-days-of-java
- JetBrains Academy: jetbrains.com/academy/

### Performance
- JVM Tuning Guide: docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/
- JDK Flight Recorder / Mission Control

### Source Code
- GitHub: Search "java", "java-se", "jdk-profiling"

---

## Design Patterns & Performance

### Books
- "Java Performance: The Definitive Guide" by Scott Oaks
- "JVM" by Roger V.G. Braithwaite
- "Java Virtual Machine Specification" (formal)

### JMH (Microbenchmark Harness)
- OpenJDK: openjdk.java.net/projects/code-tools/jmh/

### Performance Resources
- Java Performance Guides: oracle.com/technical-resources/articles/java-performance/

---

## Tools & Practice

### JDK
- OpenJDK builds: openjdk.java.net

### IDEs
- IntelliJ IDEA
- Eclipse
- VS Code with Java extensions

### Profilers
- VisualVM
- YourKit
- Flight Recorder
- JVM Mission Control

---

## Additional Resources (Community & Books)

### Official Oracle
- Java Tutorials: docs.oracle.com/javase/tutorial/
- Java SE Docs: docs.oracle.com/en/java/javase/index.html
- Java Community: community.oracle.com/tech/develop
- Java Blogs: blogs.oracle.com/java/

### OpenJDK
- Documentation: openjdk.java.net/projects/docs/
- Source: openjdk.java.net/

### Books
- Effective Java by Joshua Bloch
- Java Concurrency in Practice by Brian Goetz
- Java: The Complete Reference by Herbert Schildt

### Online Courses
- Coursera
- edX
- Udemy
- Pluralsight
- JetBrains Academy

### Blogs & Community
- Baeldung: baeldung.com/
- InfoQ: infoq.com/java/
- Stack Overflow
