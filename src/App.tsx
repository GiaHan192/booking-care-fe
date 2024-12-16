import Header from './components/Header/Header'
import useRouteElements from './useRouteElements'
import { Toaster } from 'react-hot-toast';

function App() {
  const routeElements = useRouteElements()

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4aed88',
              secondary: '#fff'
            },
          },
        }}
      />
      <div>
        {routeElements}
      </div>
    </>
  )
}

export default App
