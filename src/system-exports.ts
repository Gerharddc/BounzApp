import Config from 'react-native-config';

let system = {
    aws_project_region: 'us-east-1',
    public_images_domain: 'd1cnex4b4ykkjq.cloudfront.net',
    aws_mobile_analytics_app_id: 'b55055eee0e2484fadb07b178424feb2',
    aws_appsync_graphqlEndpoint: 'https://5dli33wzjfe25hwpmm6erycxwe.appsync-api.us-east-1.amazonaws.com/graphql',
    public_uploads_bucket: 'storage-dev2-bounzpublicuploads',
    compute_rest_endpoint: 'https://vqotjnz0kh.execute-api.us-east-1.amazonaws.com/dev2',
    misc_files_bucket: 'storage-dev2-miscfiless3bucket-15lecp9ohfta3',
    aws_cognito_identity_pool_id: 'us-east-1:dad046d0-b3e8-4d4b-a370-bbe6871e0da4',
    aws_user_pools_id: 'us-east-1_vrBg4zMhF',
    aws_user_pools_web_client_id: '3tfh2kdcr4tt8vic1q1qm369r7',
    stage: 'dev2',
    min_api: '2',
};

if (Config.STAGE === 'prod') {
    system = {
        aws_project_region: 'us-east-1',
        public_images_domain: 'dyu85xbijm4ir.cloudfront.net',
        aws_mobile_analytics_app_id: 'fdd9de04596e4328880ec399c943c086',
        aws_appsync_graphqlEndpoint: 'https://aatl3k2itfaa5o35g3apo6ka3a.appsync-api.us-east-1.amazonaws.com/graphql',
        public_uploads_bucket: 'storage-dev-bounzpublicuploads',
        compute_rest_endpoint: 'https://dsaqz7txc2.execute-api.us-east-1.amazonaws.com/dev',
        misc_files_bucket: 'storage-dev-miscfiless3bucket-1p6bviyoialu7',
        aws_cognito_identity_pool_id: 'us-east-1:f3878208-60a9-4518-8d1b-4fadcb91a3d6',
        aws_user_pools_id: 'us-east-1_4iwO9V6yu',
        aws_user_pools_web_client_id: '3f9i71imgs5qnhcdqbev39d4u8',
        stage: 'dev',
        min_api: '2',
    };
}

export default system;
