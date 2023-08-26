package com.younglabs;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.CountDownTimer;
import android.os.IBinder;
import android.util.Log;
import android.widget.RemoteViews;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.util.concurrent.TimeUnit;

public class NotificationTimerService extends Service {
    private static final int NOTIFICATION_ID = 1001;
    private static final String TAG = "CountdownService";
    private static final long COUNTDOWN_INTERVAL = 1000; // 1 second

    private CountDownTimer countDownTimer;

    private String CHANNEL_ID = "Timer";

    private NotificationCompat.Builder notification;
    private NotificationManagerCompat notificationManager;

    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Service";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            NotificationManager notificationManager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            long countdownDurationMillis = intent.getLongExtra("countdown_time", 0);
            startCountdown(countdownDurationMillis);
        }
        return START_STICKY;
    }

    private void startCountdown(long countdownDurationMillis) {
        long currentTime = System.currentTimeMillis();

        // Calculate time remaining
        long remainingTime = countdownDurationMillis - currentTime;
        countDownTimer = new CountDownTimer(remainingTime, COUNTDOWN_INTERVAL) {
            @Override
            public void onTick(long millisUntilFinished) {
                updateRemainingTime(millisUntilFinished);
            }

            @Override
            public void onFinish() {
                Log.d(TAG, "Countdown finished");
                stopSelf(); // Stop the service when the countdown finishes
                Intent activityIntent = new Intent(getApplicationContext(), MainActivity.class);
                activityIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                PendingIntent pendingIntent = PendingIntent.getActivity(getApplicationContext(), 0, activityIntent, PendingIntent.FLAG_IMMUTABLE);

                notification = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                        .setSmallIcon(R.drawable.ic_small_icon)
                        .setContentTitle("Class reminder")
                        .setContentText("You class has started. join now")
                        .setPriority(NotificationCompat.PRIORITY_HIGH)
                        .setContentIntent(pendingIntent)
                        .setAutoCancel(true);

                notificationManager = NotificationManagerCompat.from(getApplicationContext());

                notificationManager.notify(1002, notification.build());
            }
        };

        countDownTimer.start();
    }

    private void updateRemainingTime(long millisUntilFinished) {
        // Calculate days, hours, minutes, and seconds
        long days = TimeUnit.MILLISECONDS.toDays(millisUntilFinished);
        long hours = TimeUnit.MILLISECONDS.toHours(millisUntilFinished) % 24;
        long minutes = TimeUnit.MILLISECONDS.toMinutes(millisUntilFinished) % 60;
        long seconds = TimeUnit.MILLISECONDS.toSeconds(millisUntilFinished) % 60;
//        String formattedTime = String.format("%02d:%02d:%02d:%02d", days, hours, minutes, seconds);
        SendNotification(String.valueOf(days), String.valueOf(hours), String.valueOf(minutes), String.valueOf(seconds));
    }

    private void SendNotification(String days, String hours, String minutes, String seconds) {
        Intent activityIntent = new Intent(getApplicationContext(), MainActivity.class);
        activityIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(getApplicationContext(), 0, activityIntent, PendingIntent.FLAG_IMMUTABLE);

        RemoteViews contentView = new RemoteViews(getApplicationContext().getPackageName(), R.layout.counter_layout);
        contentView.setTextViewText(R.id.days, days);
        contentView.setTextViewText(R.id.hours, hours);
        contentView.setTextViewText(R.id.minutes, minutes);
        contentView.setTextViewText(R.id.seconds, seconds);

        notification = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_small_icon)
                .setContentTitle("Class timer")
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pendingIntent)
                .setAutoCancel(false)
                .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
                .setCustomContentView(contentView)
                .setOnlyAlertOnce(true);

        notificationManager = NotificationManagerCompat.from(getApplicationContext());

        notificationManager.notify(NOTIFICATION_ID, notification.build());
        startForeground(NOTIFICATION_ID, notification.build());
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        // Cancel the countdown timer when the service is destroyed
        if (countDownTimer != null) {
            countDownTimer.cancel();
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
