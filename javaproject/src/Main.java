
// 1Q
public class Main {

    public static void main(String[] args) {
        double result = smallest(25, 37, 29);
        System.out.println("The smallest value is " + result);
    }

    public static double smallest(double a, double b, double c) {
        if (a <= b && a <= c) {
            return a;
        } else if (b <= a && b <= c) {
            return b;
        } else {
            return c;
        }
    }
}
//2Q

public class Main {

    public static void main(String[] args) {
        double result = average(25, 45, 65);
        System.out.println("The average value is " + result);
    }

    public static double average(double a, double b, double c) {
        return (a + b + c) / 3;
    }
}