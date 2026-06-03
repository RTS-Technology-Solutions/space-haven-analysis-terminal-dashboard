# Contributing to S.H.A.T. Command Center

Thank you for your interest in contributing to the Space Haven Analysis Terminal! This guide will help you get started.

---

## 🎯 Ways to Contribute

### 1. Reporting Bugs
Found something broken? Help us fix it!

**Before reporting:**
- Search [existing issues](../../issues) to avoid duplicates
- Verify the bug in the latest version
- Collect relevant details (browser, OS, steps to reproduce)

**Create a bug report:** [Bug Report Template](../../issues/new?template=bug_report.md)

---

### 2. Suggesting Features
Have an idea to improve S.H.A.T.? We'd love to hear it!

**Before suggesting:**
- Check if it already exists in [issues](../../issues) or [discussions](../../discussions)
- Consider if it aligns with the project's goals
- Think about how it benefits the community

**Create a feature request:** [Feature Request Template](../../issues/new?template=feature_request.md)

---

### 3. Contributing Game Data
The data dictionary is only as good as the community makes it!

**You can contribute:**
- New game object ID mappings
- Corrections to existing data
- Additional categories or fields
- Game version-specific data

**Submit data:** [Data Update Template](../../issues/new?template=data_update.md)

**Data Guidelines:**
- Verify data accuracy before submitting
- Cite your source (save file, modding tools, observation)
- Include the Space Haven version the data is from
- Follow the existing XML structure

---

### 4. Contributing Code
Want to fix bugs or add features? Here's how!

#### Setup Your Development Environment

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/space-haven-analysis-terminal-dashboard.git
cd space-haven-analysis-terminal-dashboard

# 3. Add upstream remote
git remote add upstream https://github.com/RTS-Technology-Solutions/space-haven-analysis-terminal-dashboard.git

# 4. Install dependencies
npm install

# 5. Create a feature branch
git checkout -b feature/your-feature-name
```

#### Development Workflow

```bash
# 1. Start dev server
npm run dev

# 2. Make your changes
# Edit files in src/

# 3. Test your changes
npm run test
npm run lint
npm run build  # Verify production build works

# 4. Commit your changes
git add .
git commit -m "feat: Add your feature description"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Create a Pull Request on GitHub
```

#### Code Style Guidelines

**TypeScript:**
- Use TypeScript strict mode
- Define types for all function parameters and returns
- Avoid `any` types unless absolutely necessary
- Use functional components with hooks (no class components)

**React:**
- Functional components only
- Use hooks for state and side effects
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

**CSS:**
- Use CSS variables from `theme.css`
- Follow BEM-like naming: `.component-name__element--modifier`
- Mobile-first responsive design
- Use semantic class names

**Naming Conventions:**
- Components: `PascalCase` (e.g., `DataSheets.tsx`)
- Utilities: `camelCase` (e.g., `xmlParser.ts`)
- Constants: `UPPER_SNAKE_CASE`
- CSS classes: `kebab-case`

#### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style/formatting (no logic change)
- `refactor:` Code restructuring (no behavior change)
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat(data): Add advanced fabricator module ID

fix(search): Correct case-insensitive search filtering

docs(readme): Update installation instructions

refactor(parser): Optimize XML parsing performance
```

---

### 5. Improving Documentation
Documentation is crucial for community adoption!

**You can improve:**
- README clarity
- Code comments
- Setup instructions
- Feature documentation
- API documentation

**No PR needed for typos!** Just fix and commit directly if you have access, or open a quick issue.

---

## 🔍 Code Review Process

### What to Expect

1. **Initial Review (24-48 hours)**
   - Maintainer will review your PR
   - May request changes or ask questions
   - Automated tests must pass

2. **Iteration**
   - Address feedback by pushing new commits
   - Discuss any concerns or questions
   - Maintain a respectful, collaborative tone

3. **Approval & Merge**
   - Once approved, maintainer will merge
   - Your contribution will be in the next release!
   - You'll be added to contributors list

### Review Criteria

✅ **Code Quality:**
- Follows style guidelines
- Well-commented and readable
- No unnecessary complexity

✅ **Functionality:**
- Solves the stated problem
- Doesn't break existing features
- Includes tests (if applicable)

✅ **Documentation:**
- Updates README if needed
- Comments explain "why", not "what"
- TypeScript types are accurate

✅ **Performance:**
- No unnecessary re-renders
- Efficient algorithms
- Doesn't degrade load time

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

**Component Tests:**
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DataSheets from './DataSheets'

describe('DataSheets', () => {
  it('renders search input', () => {
    render(<DataSheets />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('filters results by search term', async () => {
    // Test implementation
  })
})
```

**Utility Tests:**
```typescript
import { describe, it, expect } from 'vitest'
import { parseXML, searchMappings } from './xmlParser'

describe('xmlParser', () => {
  it('parses valid XML', () => {
    const xml = '<mappings><skills></skills></mappings>'
    const result = parseXML(xml)
    expect(result).toHaveProperty('skills')
  })
})
```

---

## 🚫 What NOT to Contribute

❌ **Avoid these:**
- Features that require paid services
- Breaking changes without discussion
- Code that violates Space Haven EULA
- Personal credentials or API keys
- Large binary files without approval
- Unrelated dependencies
- Malicious code or tracking

---

## 🎯 Good First Issues

New to open source? Start here!

Look for issues labeled [`good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22):
- Well-defined scope
- Clear acceptance criteria
- No complex dependencies
- Maintainer guidance available

**Examples:**
- Add a new game object ID to data dictionary
- Fix a typo in documentation
- Improve error message clarity
- Add loading state to a component

---

## 💬 Getting Help

Stuck? Ask for help!

- **Questions about contributing:** [GitHub Discussions](../../discussions)
- **Clarifications on issues:** Comment on the issue
- **Technical problems:** Open a [question issue](../../issues/new?template=question.md)
- **General chat:** Space Haven Discord or Reddit

---

## 🏆 Recognition

All contributors are valued and recognized:

- **Contributors Graph:** [View contributors](../../graphs/contributors)
- **Release Notes:** Contributors mentioned in each release
- **README:** Top contributors featured
- **Community:** Eternal gratitude from the Space Haven community! 🙏

---

## 📜 Code of Conduct

### Our Standards

**Positive Behavior:**
- ✅ Be respectful and inclusive
- ✅ Welcome newcomers and help them learn
- ✅ Give and receive constructive feedback gracefully
- ✅ Focus on what's best for the community
- ✅ Show empathy and kindness

**Unacceptable Behavior:**
- ❌ Harassment, insults, or personal attacks
- ❌ Trolling or inflammatory comments
- ❌ Publishing others' private information
- ❌ Spam or off-topic discussions
- ❌ Any form of discrimination

### Enforcement

Violations may result in:
1. Warning from maintainer
2. Temporary ban from contributing
3. Permanent ban in severe cases

Report violations to: contact@rtsts.tech

---

## 📚 Additional Resources

- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

## ❓ Questions?

Not sure if your contribution fits? **Ask first!**

Open a [discussion](../../discussions) or create an issue. We're happy to help you find the right way to contribute.

---

**Thank you for making S.H.A.T. Command Center better for the Space Haven community!** 🚀

*May your PRs be merged swiftly and your code reviews be kind.* 💻✨
