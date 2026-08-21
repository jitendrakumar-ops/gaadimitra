if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "C:/Users/jiten/.gradle/caches/8.13/transforms/3f2f0b2c7b1c1125b87253ddd50db9ac/transformed/jetified-hermes-android-250829098.0.10-debug/prefab/modules/hermesvm/libs/android.armeabi-v7a/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/jiten/.gradle/caches/8.13/transforms/3f2f0b2c7b1c1125b87253ddd50db9ac/transformed/jetified-hermes-android-250829098.0.10-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

