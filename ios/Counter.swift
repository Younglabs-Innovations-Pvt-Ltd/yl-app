//
//  Counter.swift
//  YoungLabs
//
//  Created by YL Dev Team on 19/03/24.
//

import Foundation

@objc(Counter)
class Counter: NSObject {
  
  private var count = 0;
  @objc
  func increment(){
    count += 1;
    print("countt",count)
  }
}
