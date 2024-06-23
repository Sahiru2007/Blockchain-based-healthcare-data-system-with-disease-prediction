// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Cruds {
    string[] doctors;
    string[] patients;

    function addDoctor(string memory doc_cid) public {
        for (uint i = 0; i < doctors.length; i++) {
            string memory x = doctors[i];
            if (keccak256(bytes(x)) == keccak256(bytes(doc_cid))) return;
        }
        doctors.push(doc_cid);
    }

    function getDoctor() public view returns (string[] memory) {
        return doctors;
    }

    function addPatient(string memory patient_cid) public {
        for (uint i = 0; i < patients.length; i++) {
            string memory x = patients[i];
            if (keccak256(bytes(x)) == keccak256(bytes(patient_cid))) return;
        }
        patients.push(patient_cid);
    }

    function getPatient() public view returns (string[] memory) {
        return patients;
    }
    struct AccessRequest {
        string doctorCid; // Identifier of the doctor requesting access
        bool approved; // Whether the patient has approved this request
    }

    // Maps patient CIDs to their access requests
    mapping(string => AccessRequest[]) public accessRequests;

    // Doctor requests access to a patient's data
    function requestAccess(
        string memory patientCid,
        string memory doctorCid
    ) public {
        AccessRequest memory newRequest = AccessRequest(doctorCid, false);
        accessRequests[patientCid].push(newRequest);
    }

    // Patient grants or denies access to a doctor
    function respondToAccessRequest(
        string memory patientCid,
        string memory doctorCid,
        bool approve
    ) public {
        AccessRequest[] storage requests = accessRequests[patientCid];
        for (uint i = 0; i < requests.length; i++) {
            if (
                keccak256(bytes(requests[i].doctorCid)) ==
                keccak256(bytes(doctorCid))
            ) {
                requests[i].approved = approve;
                break;
            }
        }
    }
    // Maps an Ethereum address to the latest IPFS hash of the doctor's or patient's data
    mapping(address => string) public latestHashes;

    // Updates the latest hash for a doctor's data
    function updateLatestDoctorHash(
        address doctorAddress,
        string memory newHash
    ) public {
        latestHashes[doctorAddress] = newHash;
    }

    // Retrieves the latest hash for a doctor's data
    function getLatestDoctorHash(
        address doctorAddress
    ) public view returns (string memory) {
        return latestHashes[doctorAddress];
    }

    // Updates the latest hash for a patient's data
    function updateLatestPatientHash(
        address patientAddress,
        string memory newHash
    ) public {
        latestHashes[patientAddress] = newHash;
    }

    // Retrieves the latest hash for a patient's data
    function getLatestPatientHash(
        address patientAddress
    ) public view returns (string memory) {
        return latestHashes[patientAddress];
    }
}
