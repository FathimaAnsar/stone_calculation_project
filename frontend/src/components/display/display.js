import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
function ResponsiveExample() {
    return (
        <div className="box">
        <Container>
        <Table responsive>
            <thead>
            <tr>
                <th>#</th>
                {Array.from({ length: 3 }).map((_, index) => (
                    <th key={index}>Table heading</th>
                ))}
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>1</td>
                {Array.from({ length: 3 }).map((_, index) => (
                    <td key={index}>Table cell {index}</td>
                ))}
            </tr>
            <tr>
                <td>2</td>
                {Array.from({ length: 3 }).map((_, index) => (
                    <td key={index}>Table cell {index}</td>
                ))}
            </tr>

            </tbody>
        </Table>
        </Container>
        </div>
    );
}

export default ResponsiveExample;