import { createBrowserHistory, createMemoryHistory } from "history";

const isTestEnv = process.env.NODE_ENV === "test";

export const history = isTestEnv
    ? createMemoryHistory({ initialEntries: ['/'] })
    : createBrowserHistory();