package model;

public class BodyRegion {

    private String name;
    private double load;
    private double compensation;

    public BodyRegion() {

    }
    public BodyRegion(
            String name,
            double load,
            double compensation

    ) {

        this.name = name;
        this.load = load;
        this.compensation = compensation;
    }

    public String getName() {
        return name;
    }

    public double getLoad() {
        return load;
    }

    public double getCompensation() {
        return compensation;
    }

    public double getStress() {
        return load - compensation;
    }
}
