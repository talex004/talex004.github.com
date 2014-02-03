package helloworld;

import java.util.Date;

public class Hello3 {
	public static int sum(int a, int b) {
		return a+b;
	}
	public static void main(String[] args) {
		System.out.println("Hello, World.");
		System.out.println("The time is: " + new Date());
		System.out.println("8 + 7 = " + sum(8, 7));
	}
}
