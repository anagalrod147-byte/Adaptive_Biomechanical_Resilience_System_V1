package model;

public class BiomechanicalModel {

    private double spinalLoad;
    private double balance;
    private double compensationFactor;

    public BiomechanicalModel(
            double spinalLoad,
            double balance,
            double compensationFactor
    ) {

        this.spinalLoad = spinalLoad;
        this.balance = balance;
        this.compensationFactor = compensationFactor;
    }

    public double getSpinalLoad() {
        return spinalLoad;
    }

    public double getBalance() {
        return balance;
    }

    public double getCompensationFactor() {
        return compensationFactor;
    }
}