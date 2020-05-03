package com.example.zoomlinks;

import androidx.appcompat.app.AlertDialog;
import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class MainActivity extends Activity {
    private String message_title;
    private Integer current_week_day;
    private Integer current_time;
    private OkHttpClient client = new OkHttpClient();
    private String json_data_url = "https://raw.githubusercontent.com/shernandezz/zoom-links/master/JSON%20files/data.json";
    private String classroom_url;
    private JSONObject selected_class;
    private JSONArray schedule;
    private boolean isOnlyClass;

    private void requestJSONS() {
        Request request = new Request.Builder()
                .url(json_data_url)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }
            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    final String myResponse = response.body().string();
                    MainActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                JSONObject json_data = new JSONObject(myResponse);
                                schedule = json_data.getJSONArray("Horarios").getJSONArray(current_week_day);
                                JSONObject classrooms = json_data.getJSONObject("Salones");
                                checkForClassesInSchedule(schedule, classrooms);

                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    });
                }
            }
        });
    }

    public void checkForClassesInSchedule(JSONArray schedule, JSONObject rooms) {
        List<JSONObject> subjects_list = new ArrayList<JSONObject>();

        for (int subject = 0; subject < schedule.length(); subject++) {
            try {
                Integer class_start = schedule.getJSONObject(subject).getInt("Inicio");
                Integer class_end = schedule.getJSONObject(subject).getInt("Final");
                if (current_time > class_start && current_time < class_end) {
                    subjects_list.add(schedule.getJSONObject(subject));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        if (subjects_list.isEmpty()) {
            showError();
        } else {
            selected_class = subjects_list.get(0);
            if (subjects_list.size() == 1) {
                isOnlyClass = true;
                showClassDialog(rooms);
            } else {
                isOnlyClass = false;
                multipleClasses(rooms, subjects_list);
            }
        }
    }

    private void showError() {
        AlertDialog.Builder alertBuilder = new AlertDialog.Builder(MainActivity.this);
        alertBuilder.setMessage("No hay clases programadas para empezar en por lo menos una hora.")
                .setCancelable(false)
                .setPositiveButton("Aceptar", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        finish();
                    }
                });

        AlertDialog alertDialog = alertBuilder.create();
        alertDialog.setTitle("Zoom Links");
        alertDialog.show();
    }

    private void showClassDialog(JSONObject classrooms_json) {
        try {
            String classroom_name = selected_class.getString("Salon");
            classroom_url = "https://zoom.us/j/" + classrooms_json.getString(classroom_name);
            message_title = selected_class.getString("Nombre");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        AlertDialog.Builder alertBuilder = new AlertDialog.Builder(MainActivity.this);
        alertBuilder.setMessage("¿Deseas entrar al aula de " + message_title + "?")
                .setCancelable(false)
                .setPositiveButton("Cancelar", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if (isOnlyClass) {
                            finish();
                        } else {
                            dialog.dismiss();
                        }
                    }
                })
                .setNegativeButton("Copiar Link", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                        ClipData clip = ClipData.newPlainText("label",classroom_url);
                        clipboard.setPrimaryClip(clip);
                        finish();
                    }
                })
                .setNeutralButton("Aceptar", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(classroom_url));
                        startActivity(browserIntent);
                        finish();
                    }
                });

        AlertDialog alertDialog = alertBuilder.create();
        alertDialog.setTitle("Zoom Links");
        alertDialog.show();
    }

    private void multipleClasses(final JSONObject classrooms_json, final List<JSONObject> subjects) {
        final List<String> class_names = new ArrayList<String>();

        class_names.add("Seleccionar");
        for (int subject = 0; subject < subjects.size(); subject++) {
            try {
                class_names.add(subjects.get(subject).getString("Nombre"));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        try {
            String classroom_name = selected_class.getString("Salon");
            classroom_url = "https://zoom.us/j/" + classrooms_json.getString(classroom_name);
            message_title = selected_class.getString("Nombre");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        AlertDialog.Builder alertBuilder = new AlertDialog.Builder(MainActivity.this);
        alertBuilder.setMessage("Por favor selecciona la clase a la que vas a asistir:")
                .setCancelable(false)
                .setNegativeButton("Cancelar", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        finish();
                    }
                });

        View layoutInflaterView = getLayoutInflater().inflate(R.layout.spinner, null);
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(MainActivity.this, android.R.layout.simple_spinner_item, class_names);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        final Spinner spinner = (Spinner) layoutInflaterView.findViewById(R.id.spinner);
        spinner.setAdapter(adapter);
        spinner.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                        String selected_item = spinner.getSelectedItem().toString();
                        JSONObject selected_object = null;

                        if (selected_item != "Seleccionar") {
                            for (int subject = 0; subject < subjects.size(); subject++) {
                                int subject_len = 0;
                                try {
                                    subject_len = schedule.getJSONObject(subject).length();
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                                for (int item = 0; item < subject_len; item++) {
                                    String clauise = null;
                                    try {
                                        clauise = subjects.get(subject).getString("Nombre");
                                    } catch (JSONException e) {
                                        e.printStackTrace();
                                    }
                                    if (clauise == selected_item) {
                                        selected_object = subjects.get(subject);
                                    }
                                }
                            }
                            selected_class = selected_object;
                            showClassDialog(classrooms_json);
                        }
                    }
                    @Override
                    public void onNothingSelected(AdapterView<?> parent) {
                    }
                });
                return false;
            }
        });

        AlertDialog alertDialog = alertBuilder.create();
        alertDialog.setTitle("Multiples Clases Detectadas");
        alertDialog.setView(layoutInflaterView);
        alertDialog.show();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Date current_date = new Date();
        SimpleDateFormat week_day_format = new SimpleDateFormat("u");
        SimpleDateFormat hour_format = new SimpleDateFormat("H");
        SimpleDateFormat minute_format = new SimpleDateFormat("m");

        current_week_day = Integer.parseInt(week_day_format.format(current_date)) - 1;
        current_time = (Integer.parseInt(hour_format.format(current_date)) * 100) + (Integer.parseInt(minute_format.format(current_date)));

        requestJSONS();
    }
}