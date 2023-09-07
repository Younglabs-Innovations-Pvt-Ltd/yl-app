package com.younglabs;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModelStore;

public class ViewModelStoreOwner implements androidx.lifecycle.ViewModelStoreOwner {
    private final ViewModelStore viewModelStore = new ViewModelStore();
    @NonNull
    @Override
    public ViewModelStore getViewModelStore() {
        return viewModelStore;
    }
}
