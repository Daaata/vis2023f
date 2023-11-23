// 需要使用這些命名空間
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Live2D.Cubism.Framework;
using Live2D.Cubism.Core;

//private float timeCounter = 0f;

public class BlinkHandler : MonoBehaviour
{
    // 眨眼控制器變數
    private CubismEyeBlinkController blinkController;
    void Start()
    {
        // 取得眨眼控制器
        blinkController = GetComponent< CubismEyeBlinkController >();
        // 更改眼睛打開程度
        blinkController.EyeOpening = 1f;
    }

    float timeCounter = 0f;
    float count = 1f;
    float num = 0.2f;

    void Update()
    {
        // Time.deltaTime 為遊戲幀數之倒數
        timeCounter += Time.deltaTime;
        // 每兩秒眨眼一次 ( 頻率可自行決定 )
        if( timeCounter >= 2f ){
            timeCounter = 0f;
            // 執行眨眼
            blinkController.EyeOpening = 0f;
        }
        else if(timeCounter>1f){
            blinkController.EyeOpening = 1f;
        }
        
    }

}
