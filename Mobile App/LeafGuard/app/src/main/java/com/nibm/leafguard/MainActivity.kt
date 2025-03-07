package com.nibm.leafguard

import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.database.*

class MainActivity : AppCompatActivity() {
    private lateinit var tvTemperature: TextView
    private lateinit var tvHumidity: TextView
    private lateinit var tvPlant1Name: TextView
    private lateinit var tvPlant1Status: TextView
    private lateinit var tvPlant1LastCheck: TextView
    private lateinit var tvPlant2Name: TextView
    private lateinit var tvPlant2Status: TextView
    private lateinit var tvPlant2LastCheck: TextView
    private lateinit var plant1Layout: LinearLayout
    private lateinit var plant2Layout: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize UI Elements
        tvTemperature = findViewById(R.id.tvTemperature)
        tvHumidity = findViewById(R.id.tvHumidity)
        tvPlant1Name = findViewById(R.id.tvPlant1Name)
        tvPlant1Status = findViewById(R.id.tvPlant1Status)
        tvPlant1LastCheck = findViewById(R.id.tvPlant1LastCheck)
        tvPlant2Name = findViewById(R.id.tvPlant2Name)
        tvPlant2Status = findViewById(R.id.tvPlant2Status)
        tvPlant2LastCheck = findViewById(R.id.tvPlant2LastCheck)
        plant1Layout = findViewById(R.id.plant1Layout)
        plant2Layout = findViewById(R.id.plant2Layout)

        val database = FirebaseDatabase.getInstance()
        val sensorRef = database.getReference("sensor_data")
        val plant1Ref = database.getReference("Station/plant1")
        val plant2Ref = database.getReference("Station/plant2")

        // Fetch Sensor Data
        sensorRef.addValueEventListener(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val temperature = snapshot.child("temperature").getValue(Double::class.java) ?: 0.0
                val humidity = snapshot.child("humidity").getValue(Int::class.java) ?: 0

                tvTemperature.text = "Temperature: $temperature °C"
                tvHumidity.text = "Humidity: $humidity %"
            }

            override fun onCancelled(error: DatabaseError) {
                Log.e("Firebase", "Failed to fetch sensor data", error.toException())
            }
        })

        // Fetch Plant 1 Data
        plant1Ref.addValueEventListener(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val name = snapshot.child("name").getValue(String::class.java) ?: "Unknown"
                val status = snapshot.child("status").getValue(String::class.java) ?: "Unknown"
                val lastcheck = snapshot.child("lastcheck").getValue(String::class.java) ?: "Unknown"

                // Update UI
                tvPlant1Name.text = "Plant: $name"
                tvPlant1Status.text = status
                tvPlant1LastCheck.text = "Last Check: $lastcheck"

                // Change background color based on status
                if (status.startsWith("Rust") || status.startsWith("Powdery Mildew")) {
                    plant1Layout.setBackgroundColor(Color.RED)
                } else {
                    plant1Layout.setBackgroundColor(Color.parseColor("#4CAF50"))
                }
            }

            override fun onCancelled(error: DatabaseError) {
                Log.e("Firebase", "Failed to fetch plant1 data", error.toException())
            }
        })

        // Fetch Plant 2 Data
        plant2Ref.addValueEventListener(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val name = snapshot.child("name").getValue(String::class.java) ?: "Unknown"
                val status = snapshot.child("status").getValue(String::class.java) ?: "Unknown"
                val lastcheck = snapshot.child("lastcheck").getValue(String::class.java) ?: "Unknown"

                // Update UI
                tvPlant2Name.text = "Plant: $name"
                tvPlant2Status.text = status
                tvPlant2LastCheck.text = "Last Check: $lastcheck"

                // Change background color based on status
                if (status.startsWith("Rust") || status.startsWith("Powdery Mildew")) {
                    plant2Layout.setBackgroundColor(Color.RED)
                } else {
                    plant2Layout.setBackgroundColor(Color.parseColor("#4CAF50"))
                }
            }

            override fun onCancelled(error: DatabaseError) {
                Log.e("Firebase", "Failed to fetch plant2 data", error.toException())
            }
        })
    }
}
