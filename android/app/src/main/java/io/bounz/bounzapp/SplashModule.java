/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

package io.bounz.bounzapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SplashModule extends ReactContextBaseJavaModule {
    @Override
    public String getName() {
        return "SplashModule";
    }

    public SplashModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void clearBackground() {
        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getCurrentActivity().getWindow().setBackgroundDrawable(null);
            }
        });
    }
}
