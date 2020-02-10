/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

#import "PESDKModule.h"
#import <React/RCTUtils.h>
@import PhotoEditorSDK;

@interface PESDKModule () <PESDKPhotoEditViewControllerDelegate>
@end

@implementation PESDKModule

RCT_EXPORT_MODULE(PESDK);

RCTPromiseResolveBlock resolveCB;
RCTPromiseRejectBlock rejectCB;

NSString *TYPE_JPEG = @"data:image/jpeg;base64,";

RCT_REMAP_METHOD(editFromURI,
                 editFromURI:(NSString *)uri
                 withAspect:(NSString *)forcedAspect
                 withResolber:(RCTPromiseResolveBlock)resolve
                 andRejecter:(RCTPromiseRejectBlock)reject) {
  resolveCB = resolve;
  rejectCB = reject;
  
  PESDKConfiguration *configuration = [[PESDKConfiguration alloc] initWithBuilder:^(PESDKConfigurationBuilder * _Nonnull builder) {
    if (![forcedAspect isEqualToString:@""]) {
      NSArray *parts = [forcedAspect componentsSeparatedByString:@":"];
      
      if ([parts count] != 2) {
        return reject(@"PESDK-Error", @"Invalid aspect ratio string format", nil);
      }
      
      int w = [parts[0] intValue];
      int h = [parts[1] intValue];
      
      [builder configureTransformToolController:^(PESDKTransformToolControllerOptionsBuilder * _Nonnull options) {
        options.allowFreeCrop = NO;
        options.allowedCropRatios = @[[[PESDKCropAspect alloc] initWithWidth:w height:h]];
      }];
      
      [builder configurePhotoEditorViewController:^(PESDKPhotoEditViewControllerOptionsBuilder * _Nonnull options) {
        options.forceCropMode = YES;
      }];
    }
  }];
  
  PESDKPhoto *photo;
  if ([uri hasPrefix:TYPE_JPEG]) {
    NSString *base64 = [uri substringFromIndex:[TYPE_JPEG length]];
    photo = [[PESDKPhoto alloc] initWithData:[[NSData alloc] initWithBase64EncodedString:base64 options:0]];
  } else {
    photo = [[PESDKPhoto alloc] initWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:uri]]];
  }
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *currentViewController = RCTPresentedViewController();
    
    PESDKPhotoEditViewController *photoEditViewController = [[PESDKPhotoEditViewController alloc] initWithPhotoAsset:photo configuration:configuration];
    photoEditViewController.delegate = self;
    
    [currentViewController presentViewController:photoEditViewController animated:YES completion:nil];
  });
}

#pragma mark - IMGLYPhotoEditViewControllerDelegate

- (void)photoEditViewController:(PESDKPhotoEditViewController *)photoEditViewController didSaveImage:(UIImage *)image imageAsData:(NSData *)data {
  [photoEditViewController.presentingViewController dismissViewControllerAnimated:YES completion:^{
    NSString *base64 = [data base64EncodedStringWithOptions:0];
    
    NSString *uri = [TYPE_JPEG stringByAppendingString:base64];
    NSNumber *width = [NSNumber numberWithFloat:image.size.width];
    NSNumber *height = [NSNumber numberWithFloat:image.size.height];
    NSNumber *size = [NSNumber numberWithUnsignedInteger:data.length];
    resolveCB(@{ @"uri": uri, @"width":width, @"height":height, @"fileSize":size, @"type":@"image/jpeg" });
  }];
}

- (void)photoEditViewControllerDidCancel:(PESDKPhotoEditViewController *)photoEditViewController {
  [photoEditViewController.presentingViewController dismissViewControllerAnimated:YES completion:^{
    resolveCB(nil);
  }];
}

- (void)photoEditViewControllerDidFailToGeneratePhoto:(PESDKPhotoEditViewController *)photoEditViewController {
  // TODO: get error details from the SDK
  rejectCB(@"PESDK-Error", @"PESDK could not generate photo", nil);
}

@end
