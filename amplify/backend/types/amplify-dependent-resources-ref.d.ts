export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "automatedgatekeepere0cc3ae4": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "api": {
        "automatedgatekeeper": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "storage": {
        "imagestorage": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "function": {
        "RekognitionIndexFacesTriggerc5dc3534": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "predictions": {
        "identifypeople": {
            "region": "string",
            "collectionId": "string",
            "celebrityDetectionEnabled": "string",
            "maxEntities": "string"
        }
    }
}