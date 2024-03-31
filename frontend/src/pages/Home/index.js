import InputForm from '../../components/ESGForm';
import Layout from '../Layout';

const Home = () => {
  
  return (
    <div className="App">
      <header className="App-header">
     <Layout />
      </header>
      <div>
      <InputForm />
      </div>
    </div>
  );
}

export default Home;