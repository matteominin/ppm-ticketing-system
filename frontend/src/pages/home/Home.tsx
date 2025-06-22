import Header from '../../components/header/Header.tsx'
import Notification from '../../components/notification/Notification.tsx'
import Events from './components/Events.tsx'

const Home = () => {
    return (
        <>
            <Header />
            <Events />
            <Notification />
        </>
    )
}

export default Home