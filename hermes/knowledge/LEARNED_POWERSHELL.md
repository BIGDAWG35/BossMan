# PowerShell Learning

## Overview
PowerShell is a cross-platform task automation solution made up of a command-line shell, a scripting language, and a configuration management framework.

## Official Resources

### Microsoft Learn (learn.microsoft.com/powershell/)
- Comprehensive documentation
- Getting started guides
- Sample scripts
- Download/installation guides
- PowerShell Module Browser
- Reference materials

### PowerShell Gallery (powershellgallery.com)
- Modules
- Scripts
- Desired State Configuration (DSC)

### GitHub (github.com/PowerShell/PowerShell)
- Source code
- Examples
- Community contributions

## Core Concepts

### Basic Commands
- `Get-Help` - Get help for commands
- `Get-Command` - List available commands
- `Get-Service` - List services
- `Get-Process` - List processes

### Scripting Basics
- **Variables** - `$variable = value`
- **Pipelines** - `|` to pass objects between commands
- **Objects** - Everything is an object with properties/methods
- **Conditionals** - If/Else statements
- **Loops** - For, foreach, while

### Practical Scripting (Days 6-8)
- File operations
- Registry access
- Event logs
- User management

### Modules (Days 9-10)
- `Import-Module` - Load a module
- `Get-Module` - List loaded modules
- Writing functions

## Key Features

### PowerShell Editions
- Windows PowerShell (5.1, older)
- PowerShell 7+ (cross-platform: Windows, macOS, Linux)

### Utility Modules
- PSScriptAnalyzer - Script analysis
- SecretManagement - Credential handling
- Crescendo - CLI to PowerShell

### Desired State Configuration (DSC)
- DSC 3.0, 2.0, 1.1
- Configuration management
- Infrastructure as Code

### Azure Integration
- Azure Cloud Shell
- Azure PowerShell modules
- Azure Automation runbooks

## Development Tools
- Visual Studio Code with PowerShell Extension
- VS Code remote editing/debugging

## Community Resources
- PowerShell Tech Community
- PowerShell.org
- Stack Overflow (tag: powershell)
- r/PowerShell (Reddit)
- PowerShell Slack
- Discord

## Quick-Start Roadmap (10 Days)

### Day 1-2: Basics
- What is PowerShell vs CMD
- Basic commands: Get-Help, Get-Command, Get-Service, Get-Process

### Day 3-5: Scripting Basics
- Variables
- Pipelines
- Objects
- If/Else, loops

### Day 6-8: Practical Scripting
- File operations
- Registry access
- Event logs

### Day 9-10: Modules & Automation
- Import-Module
- Writing functions

### Ongoing
- Explore community scripts
- Publish own scripts
- Keep a script notebook

## Books & Learning
- "Learn Windows PowerShell in a Month of Lunches" (Don Jones)
- "Windows PowerShell in Action"
- Check library eBook editions

## Video Tutorials
- Tech with Tim
- Adam the Automator
- Don Jones and Jeff Hicks
- Udemy courses

---

## PowerShell for Programmers (Microsoft DevBlogs)

### Overview
- **Source**: Microsoft Scripting Blog (devblogs.microsoft.com/scripting/)
- **Target**: Programmers with C, C++, C#, Java, Perl, Python background
- **Author**: Premier Field Engineer (Kory)

### Series Topics (Quick Start Guide)

1. **Basic Syntax – CMDLETS**
2. **Basic Syntax – Variables, Objects, and Data Types**
3. **What happened to my operators?** (==, !=, >= etc.)
4. **How to write function the right way**
5. **Doing more with functions: Taking Parameters on the Pipe**
6. **Doing more with functions: Verbose logging, Risk mitigation, Parameter Sets**
7. **Adding help data to functions** (Comment-based help)
8. **Double quotes, single quotes, and other quirks with strings**
9. **Here Strings**
10. **Let the switch statement do some extra work for you!**

### Key Focus
- Quicks that work for admins but trip up programmers
- Avoiding common mistakes
- Writing functions properly
- Parameter handling
- String quirks

### Resource
- devblogs.microsoft.com/scripting/powershell-for-programmers-a-quick-start-guide/
