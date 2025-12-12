import Home from '../page';

export default function AllPage(props) {
    // Default to new sort
    const newProps = {
        ...props,
        searchParams: { sort: 'new' }
    };
    return <Home {...newProps} />;
}
