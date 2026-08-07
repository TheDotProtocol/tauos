# Tau Compatibility Platform — product definition (M5.1)
# Integrate via: scripts/mobile/apply-compatibility-to-aosp.sh
# Requires: synced AOSP tree at AOSP_WORKSPACE

PRODUCT_NAME := tau_compatibility
PRODUCT_DEVICE := tau_compat
PRODUCT_MODEL := Tau Core Mobile Beta
PRODUCT_BRAND := Tau
PRODUCT_MANUFACTURER := TauOS
PRODUCT_SYSTEM_NAME := TauOS

# Tau platform namespace — read by future Tau Services (M6+)
PRODUCT_PROPERTY_OVERRIDES += \
    ro.tau.platform=aosp-beta \
    ro.tau.channel=beta \
    ro.tau.version=1.0.0 \
    ro.tau.compatibility=1 \
    ro.product.locale=en-US

# M5.1: NO GMS removal — inherit AOSP only
# M5.2+: PRODUCT_PACKAGES -= GmsCore GmsStore etc.

# Overlay paths (relative to vendor/tau after apply)
PRODUCT_PACKAGE_OVERLAYS += vendor/tau/overlay

# Copy Tau config props
PRODUCT_COPY_FILES += \
    vendor/tau/config/tau.prop:$(TARGET_COPY_OUT_SYSTEM)/etc/tau.prop

# Boot animation (placeholder — replace with Figma assets in M7+)
# PRODUCT_COPY_FILES += vendor/tau/bootanimation/bootanimation.zip:system/media/bootanimation.zip

$(call inherit-product, $(SRC_TARGET_DIR)/product/core_64_bit.mk)
$(call inherit-product, $(SRC_TARGET_DIR)/product/aosp_base.mk)

PRODUCT_NAME := tau_compatibility
PRODUCT_DEVICE := tau_compat
PRODUCT_PACKAGE := tau_compatibility
