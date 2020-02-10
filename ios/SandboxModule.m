/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>

/*
 This module can tell JS if the app is using APS in Sandbox mode based on preprocessor macro
 called APS_SET that should be set to NO only for archive builds. This was achieved by adding
 a custom build configuration for archiving.
 */

@interface SandboxModule : NSObject <RCTBridgeModule>
@end

@implementation SandboxModule

RCT_EXPORT_MODULE(Sandbox);

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (NSDictionary *)constantsToExport
{
#if APS_SANDBOX == 1
  return @{ @"isSandbox": @YES };
#elif APS_SANDBOX == 0
  return @{ @"isSandbox": @NO };
#else
  return @{ @"isSandbox": [NSNull null] };
#endif
}

@end
