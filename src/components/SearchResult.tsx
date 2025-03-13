import React from "react";
import Table from "react-bootstrap/Table";

interface SearchResultProps {
    results: any[];
}

const SearchResult: React.FC<SearchResultProps> = ({ results }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Gender</th>
                </tr>
            </thead>
            <tbody>
                {results.map((result, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                            {result.patient_info?.first_name} {result.patient_info?.last_name}
                        </td>
                        <td>{result.patient_info?.address}</td>
                        <td>{result.patient_info?.phone}</td>
                        <td>{result.patient_info?.gender}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default SearchResult;
