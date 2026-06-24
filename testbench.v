`timescale 1ns / 1ps

module testbench();
    reg clk; //inputs
    reg rst;
    reg [7:0] idata; //inputs
    reg ivalid;
    reg oready;
    wire iready;
    wire [7:0] odata;
    wire ovalid;

    s_box_forward s_insit(.clk(clk),.rst(rst),.idata(idata),.ivalid(ivalid),.oready(oready),.iready(iready),.odata(odata), .ovalid(ovalid)); 
    always
        #5 clk = !clk; 
        
    initial begin
        clk <= 0;
        rst <=1;
        
        #10
        rst <=0;
        idata <= 8'b00000000;
        ivalid <= 1'b1;
        oready <= 1'b1;
        
        #10
        idata <= 8'b11111111;
        
        #10
        idata <= 8'b10101010;
        
        #100
        $finish;
    end
 
endmodule

    
    
