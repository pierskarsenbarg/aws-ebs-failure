import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const vpc = new awsx.ec2.Vpc("vs-code-vpc", {
    cidrBlock: "10.0.0.0/24",
    subnets: [{ type: "public", name: "vscode-public" }],
    numberOfAvailabilityZones: 1
});

const amiId = aws.ec2.getAmi({
    filters: [
        {
            name: "name",
            values: ["amzn-ami-hvm-*"],
        },
    ],
    owners: ["137112412989"], // This owner ID is Amazon
    mostRecent: true,
}).then((ami) => ami.id);

const ec2 = new aws.ec2.Instance("instance", {
    instanceType: aws.ec2.InstanceType.T3_Small,
    ami: amiId,
    rootBlockDevice: {
        volumeSize: 40,
    },
    subnetId: pulumi.output(vpc.publicSubnetIds)[0],
    tags: {
        "Name": "ebs-size-test"
    }
}, { ignoreChanges: ["ami"] });