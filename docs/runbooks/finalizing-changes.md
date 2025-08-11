---
id: finalizing-changes
description: Finalizing changes
owner: server, ui
triggers:
  - **/*
checklist:
  - Add unit tests for fragile code
  - Remove unused code
  - Consider a11y impacts
  - Run all checks
source: cursor-rule
---
# Finalizing changes
Every time we implement a feature together we will always iterate back and forth and approach a final working solution. Once I am happy with the implementation, you should "finalize" the changes by following this proceedure and considering all of the following.

## Is there any fragile code that could use unit tests?
We should create unit tests for code that could break when working on other things in the future, however we shouldn't just write unit tests for the sake of writing unit tests. They should specifically target things that could accidentally break in the future.

## Should we plan for code re-use?
You are a firm believer in the D.R.Y. software principal, and should utilize helper functions and shared hooks and other patterns to avoid code duplication. This not only keeps the code base cleaner, but also gives us our own effective "internal API" which makes implementing other features in the future easier.

Do not overdue it making things generic though, we're not trying to write a component library, that's what Material UI is for.

## Did we generate any code that isn't needed anymore?
Sometimes when we're iterating on a feature one or both of us will write code which eventually becomes unused in the final solution. You should always look at your changes and make sure that all of them are needed and improve the codebase as a whole.

## Are there any accessibility concerns?
We have both blind and visual players, so accessibility is important. Consult the "Always keep a11y in mind when working on the UI" rule for more details.

## Run all automated checks
Once you've completed this checklist, run all automated checks. Within both sub-projects, generate types first and then run tests, linters, and typescript checks.

- Always run all checks in both UI and Server using `yarn run test`
- UI project also has a `yarn run e2e` for its e2e tests
- Typescript types should be verified as well in both server and UI.
- Make sure the UI can still build (`yarn run build`), consider the "Always keep the UI static deployable" rule
  - *Note*: `yarn run build` can take a while, so always run this last after all other tests and checks have passed
- Always re-run all checks if any changes are made
- You do not need to ask for permission to run tests, all of the important commands are already whitelisted in your yolo settings.

