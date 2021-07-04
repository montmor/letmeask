import { BrowserRouter, Route } from "react-router-dom";
import { createContext, useState } from "react";

import { Home } from "./pages/Home/Home";
import { NewRoom } from "./pages/NewRoom/NewRoom";

export const TestContext = createContext({} as any);

function App() {
  const [value, setValue] = useState("teste");
  
  return (
    <BrowserRouter>
      <TestContext.Provider value={{value, setValue}}>
        <Route path="/" exact component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
      </TestContext.Provider>
    </BrowserRouter>
  );
}

export default App;
