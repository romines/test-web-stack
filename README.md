# User Manager
## A Fullstack React Apollo GraphQL App

### General Approach
Imagine this set of features represents an MVP of a production app. Don't over engineer things in the name of cleverness. That would 1) delay shipping and 2) invest too much in an idea that might change (it's an MVP after all). On the other hand, the patterns and architecture established here should clearly communicate developer intent (the best path to maintainability, IMO), and provide a foundation to quickly add new features later.

### Architecture highlights
* React, Apollo, TypeScript frontend
* Node, Express, GraphQL, TypeScript server

#### Client 
* Functional components with React hooks for statefulness
* Queries and mutations derived from schema via [GraphQL Code Generator](https://www.graphql-code-generator.com/)
* Fully keyboard navigable
* Google Maps API with geocoding to display user address

#### Server (not the focus of this project, but...)
* Types defined in models via [TypeGraphQL](https://typegraphql.com/)
* [TypeORM](https://typeorm.io/) facilitates persistence with handy decorators
* SQLite for simple db (I would probably use Postgres for a production app)


## Running the app
```bash
cd test-web-stack
echo 'REACT_APP_GMAPS_API_KEY=<valid Google Maps API key>' > client/.env
npm install
npm run start
```

## Running tests
```bash
# cold start (nothing is running yet)
npm run test
# or, with app running
cd client && npm run test
```
> **NB:** For some reason running the SQLite executable via `npx sqlite3`  is not working on Node 16, so db seeding / cleanup is skipped on Node versions > 15.



## Implementation and Tradeoffs
### Using an uncontrolled form
I use a single `onSubmit` handler and [an 'uncontrolled' form](https://github.com/romines/test-web-stack/blob/master/client/src/components/UserForm/index.tsx). 
```javascript
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const target = e.target as HTMLFormElement;
  const formData = new FormData(target);
  const [name, address, description] = userKeys.map((p) => formData.get(p) as string);
  updateUser({ name, address, description });  // callback from parent
};
```
I like this approach for simple forms, as it cuts down on boilerplate, has great accessibility and keyboard event support out of the box, and doesn't require handling (or tearing down) intermediate state, _however_, when I later needed a `useEffect` hook to reactively update the map on user address change, it required tracking the address value in a separate piece of state. This looks a little duplicative at first glance and as the form grew in complexity there may be other reasons to use a controlled form. `¯\_(ツ)_/¯`

### State management
This app concentrates state and persistence coordination in a single 'smart' component, [UserManager](https://github.com/romines/test-web-stack/blob/master/client/src/components/UserManager/index.tsx). This works great for an app of this size, with limited need for state to be shared across disparate parts of the component tree. However, this situation would likely change pretty quickly. The next tool to reach for would obviously depend on the requirements, but might include the Context API or a simple event bus for limited shared state, or Redux or a state machine solution such as XState (especially if the application was form-heavy) for more involved shared state.

### Cypress tests only
Reasonable 'happy path' coverage is provided by [a few end to end tests](https://github.com/romines/test-web-stack/blob/master/client/cypress/integration/e2e.spec.js) run with Cypress. As the app grows, one would definitely want to add some component tests, but when React Testing Library had trouble with ES Modules that couldn't be quickly resolved, I decided it wasn't worth delaying shipping at this stage.

### Sass component stylesheets
My favorite styling strategy of late is TailwindCSS. However,  Tailwind tends to trade a steeper up-front investment for great developer experience later. Other options include **styled-components**, which provides great encapsulation in exchange for a little bit of architectural overhead. All things considered, at this scale simple `.scss` stylesheets get the job done and provide a nice authoring experience. In the medium term, one could add unique component IDs to ward off collisions, or go ahead and implement Tailwind, which would pay dividends down the road. 
