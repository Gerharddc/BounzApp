/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

package io.bounz.bounzapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.util.Base64;
import android.webkit.MimeTypeMap;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

import ly.img.android.pesdk.assets.filter.basic.FilterPackBasic;
import ly.img.android.pesdk.assets.font.basic.FontPackBasic;
import ly.img.android.pesdk.assets.frame.basic.FramePackBasic;
import ly.img.android.pesdk.assets.overlay.basic.OverlayPackBasic;
import ly.img.android.pesdk.assets.sticker.emoticons.StickerPackEmoticons;
import ly.img.android.pesdk.assets.sticker.shapes.StickerPackShapes;
import ly.img.android.pesdk.backend.model.config.CropAspectAsset;
import ly.img.android.pesdk.backend.model.state.AssetConfig;
import ly.img.android.pesdk.backend.model.state.EditorLoadSettings;
import ly.img.android.pesdk.backend.model.state.EditorSaveSettings;
import ly.img.android.pesdk.backend.model.state.manager.SettingsList;
import ly.img.android.pesdk.ui.activity.ImgLyIntent;
import ly.img.android.pesdk.ui.activity.PhotoEditorBuilder;
import ly.img.android.pesdk.ui.model.state.UiConfigAspect;
import ly.img.android.pesdk.ui.model.state.UiConfigFilter;
import ly.img.android.pesdk.ui.model.state.UiConfigFrame;
import ly.img.android.pesdk.ui.model.state.UiConfigOverlay;
import ly.img.android.pesdk.ui.model.state.UiConfigSticker;
import ly.img.android.pesdk.ui.model.state.UiConfigText;
import ly.img.android.pesdk.ui.panels.item.CropAspectItem;

public class PESDKModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    @Override
    public String getName() {
        return "PESDK";
    }

    public PESDKModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @ReactMethod
    public void editFromURI(String uri, String forcedAspect, Promise promise) {
        mPESDKPromise = promise;
        try {
            if (uri.startsWith(URI_BASE64)) {
                final String uriExt = MimeTypeMap.getFileExtensionFromUrl(uri);
                final String ext = (uriExt != null && !uriExt.isEmpty()) ? uriExt : "jpg";

                final Context context = getReactApplicationContext();
                final File outputFile = new File(context.getCacheDir().getPath() + "/inpic." + ext);
                final FileOutputStream fo = new FileOutputStream(outputFile);

                byte[] data = Base64.decode(uri.replace(URI_BASE64, ""), Base64.DEFAULT);
                fo.write(data);
                uri = outputFile.toURI().toString();
            }

            openEditorForUri(Uri.parse(uri), forcedAspect);
        } catch (Exception e) {
            promise.reject(E_IO_EXCEPTION, e);
        }
    }

    private Promise mPESDKPromise;

    private static final int PESDK_EDITOR_RESULT = 1;
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "ACTIVITY_DOES_NOT_EXIST";
    private static final String E_IO_EXCEPTION = "IO_EXCEPTION";
    private static final String URI_BASE64 = "data:image/jpeg;base64,";

    private void openEditorForUri(Uri uri, String forcedAspect) {
        if (getCurrentActivity() == null) {
            mPESDKPromise.reject(E_ACTIVITY_DOES_NOT_EXIST, new Exception("Activity does not exist"));
            return;
        }

        try {
            final Context context = getReactApplicationContext();
            final String outPath = context.getCacheDir().getPath() + "/outpic.jpg";

            SettingsList settingsList = new SettingsList();

            settingsList.getSettingsModel(UiConfigFilter.class).setFilterList(
                    FilterPackBasic.getFilterPack()
            );

            settingsList.getSettingsModel(UiConfigText.class).setFontList(
                    FontPackBasic.getFontPack()
            );

            settingsList.getSettingsModel(UiConfigFrame.class).setFrameList(
                    FramePackBasic.getFramePack()
            );

            settingsList.getSettingsModel(UiConfigOverlay.class).setOverlayList(
                    OverlayPackBasic.getOverlayPack()
            );

            settingsList.getSettingsModel(UiConfigSticker.class).setStickerLists(
                    StickerPackEmoticons.getStickerCategory(),
                    StickerPackShapes.getStickerCategory()
            );

            settingsList.getSettingsModel(EditorLoadSettings.class)
                    .setImageSource(uri);

            settingsList.getSettingsModel(EditorSaveSettings.class)
                    .setOutputFilePath(outPath)
                    .setSavePolicy(EditorSaveSettings.SavePolicy.RETURN_ALWAYS_ONLY_OUTPUT);

            if (!forcedAspect.equals("")) {
                String parts[] = forcedAspect.split(":");
                if (parts.length != 2) {
                    throw new Exception("Invalid aspect ratio string format");
                }

                int w = Integer.valueOf(parts[0]);
                int h = Integer.valueOf(parts[1]);

                AssetConfig config = settingsList.getConfig();
                config.getAssetMap(CropAspectAsset.class).clear().add(
                        new CropAspectAsset("forced", w, h, false)
                );

                UiConfigAspect uiConfig = settingsList.getSettingsModel(UiConfigAspect.class);
                uiConfig.setAspectList(
                        new CropAspectItem("forced")
                );
            }

            new PhotoEditorBuilder(getCurrentActivity())
                    .setSettingsList(settingsList)
                    .startActivityForResult(getCurrentActivity(), PESDK_EDITOR_RESULT);
        } catch (Exception e) {
            mPESDKPromise.reject(E_IO_EXCEPTION, e);
        }
    }

    private void resolveImage(Uri uri) {
        try {
            final Context context = getReactApplicationContext();
            final InputStream is = context.getContentResolver().openInputStream(uri);
            Bitmap bmp = BitmapFactory.decodeStream(is);

            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            bmp.compress(Bitmap.CompressFormat.JPEG, 100, stream);
            byte[] image = stream.toByteArray();
            String base64 = Base64.encodeToString(image, Base64.DEFAULT);

            WritableMap map = Arguments.createMap();
            map.putString("uri", URI_BASE64 + base64);
            map.putDouble("width", bmp.getWidth());
            map.putDouble("height", bmp.getHeight());
            map.putInt("fileSize", image.length);
            map.putString("type", "image/jpeg");

            mPESDKPromise.resolve(map);
        } catch (Exception e) {
            mPESDKPromise.reject(E_IO_EXCEPTION, e);
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            case PESDK_EDITOR_RESULT: {
                switch (resultCode) {
                    case Activity.RESULT_CANCELED:
                        mPESDKPromise.resolve(null);
                        break;
                    case Activity.RESULT_OK:
                        Uri resultUri = data.getParcelableExtra(ImgLyIntent.RESULT_IMAGE_URI);
                        resolveImage(resultUri);
                        break;
                }
                mPESDKPromise = null;
                break;
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {}
}
