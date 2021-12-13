# Social Media Website

This is a a social media website built in Express.

heroku: https://social-media-project-frontend.herokuapp.com/

While running locally: http://localhost:3000

## User Stories

- **Signup:** As an anon I can sign up in the platform so that I can start using the website
- **Login:** As a user I can login to the app so that I use the website
- **Logout:** As a user I can logout from the website
- **Add Post** As a user I can add a post to the website
- **Edit Post** As a user I can edit one of my posts in the website
- **Delete Post** As a user I can delete one of my posts in the website
- **Like a Post** As a user I like a post in the website
- **Add Comment** As a user I can add a comment to a post in the website
- **Edit Comment** As a user I can edit one of my comments in the website
- **Delete Comment** As a user I can delete one of my comments in the website
- **See Users** As a user with a `admin` role I can see all the users
- **Delete Users** As a user with a `admin` role I can delete any user
- **Delete User Post** As a user with a `admin` role I can delete any user post
- **Delete User Comment** As a user with a `admin` role I can delete any user comment

## Getting Started

### Installing Dependencies

#### Node js

Follow instructions to install the latest version of Node js for your platform in the [Node js docs](https://nodejs.org/en/).

#### NPM Dependencies

Once you have the project in your local machine, install dependencies by running:

```bash
npm install
```

This will install all of the required packages.

##### Key Dependencies

- [React](https://reactjs.org/) A JavaScript library for building user interfaces.

- [firebase](https://www.npmjs.com/package/firebase) provides the tools and infrastructure you need to develop, grow, and earn money from your app.

- [axios](https://www.npmjs.com/package/axios) is a promise based HTTP client for the browser and node.js.

- [redux](https://www.npmjs.com/package/redux) is a predictable state container for JavaScript apps.

- [react-redux](https://www.npmjs.com/package/react-redux) is a React bindings for Redux.

- [redux-devtools-extension](https://www.npmjs.com/package/redux-devtools-extension) is a debugging platform for Redux apps.

- [react-icons](https://react-icons.github.io/react-icons/) Include popular icons in your React projects easily with react-icons.

- [material-ui](https://mui.com/) MUI provides a robust, customizable, and accessible library of foundational and advanced components, enabling you to build your own design system and develop React applications faster.

- [sweetalert2](https://sweetalert2.github.io/) A Beautiful, Responsive, Customizable, Accessible (Wai-aria) Replacement For Javascript's Popup Boxes.

- [popup-tools](https://www.npmjs.com/package/popup-tools) Several simple tools to handle popups with callbacks. Posting data to popups as well as receiving data from them.

- [react-password-checklist](https://www.npmjs.com/package/react-password-checklist) A React Component to display the success or failure of password strength rules that updates as a user types.

- [react-verification-code-input](https://www.npmjs.com/package/react-verification-code-input) A verification code input.

## Running the server

To run the server, execute:

```bash
npm start
```

## Router Routes

| Path                 | Component | Permissions | Behavior                                    |
| -------------------- | --------- | ----------- | ------------------------------------------- |
| `/`                  | Posts     | user only   | Posts/Home page, Shows all the posts        |
| `/signup`            | Signup    | public      | Signup form, navigate to login after signup |
| `/login`             | Login     | public      | Login form, navigate to todos after login   |
| `/posts/:id`         | Post      | user  only  | Shows a post                                |
| `/dashboard`         | Dashboard | admin only  | Shows all users in the app                  |
| `/verify_account/id` | VerifyTheAccount | user only  | A page enables the user to activate their account |
| `/verify_from_email` | VerifyFromEmail | user only  | A wlecome page to a user after register |
| `/reset_password/id` | ResetPassword | user only  | A page to let a user change his password |

## Components

- Login
- Signup
- Navbar
- Posts
- Post
- Dashboard
- VerifyTheAccount
- VerifyFromEmail
- ResetPassword

## UML Diagram

![UML digram](https://user-images.githubusercontent.com/92247874/145693537-19a80ac3-73bc-4b15-ac41-dbd9d619ceab.jpg)

## Design

### Color palette

| Eggshell    | Terra Cotta | Green Sheen | Deep Champagne |
| ------- | ----------------- | ---------- | ---------- |
| #F4F1DE | #E07A5F           | #81B29A    | #F2CC8F    |
