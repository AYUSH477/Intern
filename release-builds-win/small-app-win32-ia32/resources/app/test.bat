
@ECHO OFF
FOR /L %%i IN (0, 1, 300) Do (
    ping 127.0.0.1 -n 0.5 > nul
    ECHO %%i
) 
@ECHO ON