# Contributing
First, thank you for your interest in contributing to Lipoic!
We appreciate all kinds of contributions.
If you have any question, please feel free and ask on [Discord](https://discord.gg/ArKk54ajfr) or
[GitHub](https://github.com/Lipoic/Lipoic-Backend/discussions).

## Pull requests
Appreciate your willingness to contribute, you may follow the steps below:
- Fork the repository.
- Make changes and follow our [guidelines](#contributing-guidelines).
- Issue a pull request.

Please note that unfinished pull requests should be marked as drafts.

## Contributing guidelines

### Commits
A commit should focus on one thing only. If necessary, update associated documents and tests in the same commit.

The title of a commit message consists of the type, scope, and short description of the change (less than 50 characters).
If needed, you may also provide further information in the other paragraphs.
The footer contains the issue number, breaking change description, and co-authors if available.

For example, a good commit message looks like:
```text
feat(class)!: joining a invite-only class returns 404 now

BREAKING CHANGE:
Joining a invite-only class returns 404 instead of 403 now to avoid from potential security issue.

Co-authored-by: Luminous-Coder <luminous.coder@gmail.com>
```

Available types include:

| Type       | Description             |
|------------|-------------------------|
| `feat`     | Feature                 |
| `fix`      | Bug fix                 |
| `perf`     | Performance improvement |
| `refactor` | Refactoring             |
| `test`     | Test                    |
| `style`    | Code style              |
| `docs`     | Documentation           |
| `ci`       | Continuous integration  |
| `chore`    | Chore                   |
| `revert`   | Commit reverting        |

A exclamation mark (`!`) is added for breaking changes.

### Code style
Basically, use the prettier.

Line separators are LF, and each line ends with one.
