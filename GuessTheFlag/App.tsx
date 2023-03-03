import Start from "./src/screens/Start";
import GlobalProvider from "./src/context/GlobalProvider";
import "./src/style/index.scss";
const App = () => {
  return (
    <GlobalProvider>
      <Start />
    </GlobalProvider>
  ); //return
}; //fn

export default App;
