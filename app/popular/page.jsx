import Home from '../page';

export default function PopularPage(props) {
    // Force sort to trending
    const newProps = {
        ...props,
        searchParams: { sort: 'trending' }
    };
    return <Home {...newProps} />;
}
