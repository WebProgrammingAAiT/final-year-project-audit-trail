async function main() {
    const AuditTrail = await ethers.getContractFactory("AuditTrail");
    const audit_trail = await AuditTrail.deploy();
    console.log("Contract deployed to address: ", audit_trail.address);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });