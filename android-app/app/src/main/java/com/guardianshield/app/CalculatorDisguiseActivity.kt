package com.guardianshield.app

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class CalculatorDisguiseActivity : AppCompatActivity() {

    private lateinit var tvDisplay: TextView
    private var currentInput = ""
    private val SECRET_MASTER_PIN = "98234"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_calculator_disguise)

        tvDisplay = findViewById(R.id.tvDisplay)

        val numberButtons = listOf(
            R.id.btn0, R.id.btn1, R.id.btn2, R.id.btn3, R.id.btn4,
            R.id.btn5, R.id.btn6, R.id.btn7, R.id.btn8, R.id.btn9,
            R.id.btnDot, R.id.btnPlus, R.id.btnMinus, R.id.btnMultiply, R.id.btnDivide
        )

        for (btnId in numberButtons) {
            findViewById<Button>(btnId).setOnClickListener {
                val text = (it as Button).text.toString()
                if (tvDisplay.text == "0") {
                    currentInput = text
                } else {
                    currentInput += text
                }
                tvDisplay.text = currentInput
            }
        }

        // Clear button
        findViewById<Button>(R.id.btnC).setOnClickListener {
            currentInput = ""
            tvDisplay.text = "0"
        }

        // Equals button (Checks for secret master PIN to unlock Parent Portal!)
        findViewById<Button>(R.id.btnEquals).setOnClickListener {
            if (currentInput == SECRET_MASTER_PIN || currentInput.endsWith(SECRET_MASTER_PIN)) {
                // Unlock Hidden Parent Controls Screen!
                val intent = Intent(this, MainActivity::class.java)
                startActivity(intent)
                finish()
            } else {
                // Perform regular math calculation so child sees real calculator
                try {
                    val result = evaluateSimpleExpression(currentInput)
                    tvDisplay.text = result
                    currentInput = result
                } catch (e: Exception) {
                    tvDisplay.text = "0"
                    currentInput = ""
                }
            }
        }
    }

    private fun evaluateSimpleExpression(expression: String): String {
        return try {
            if (expression.contains("+")) {
                val parts = expression.split("+")
                (parts[0].trim().toDouble() + parts[1].trim().toDouble()).toString()
            } else if (expression.contains("-")) {
                val parts = expression.split("-")
                (parts[0].trim().toDouble() - parts[1].trim().toDouble()).toString()
            } else if (expression.contains("×") || expression.contains("*")) {
                val parts = expression.split(Regex("[×*]"))
                (parts[0].trim().toDouble() * parts[1].trim().toDouble()).toString()
            } else {
                expression
            }
        } catch (e: Exception) {
            expression
        }
    }
}
