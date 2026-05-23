package app;

import model.BodyRegion;
import prediction.CompensationEngine;
import simulation.SimulationLoader;
import visualization.HeatmapGenerator;

import java.util.ArrayList;

public class Main {

    public static void main(String[] args) {

        SimulationLoader loader =
                new SimulationLoader();

        ArrayList<BodyRegion> regions =
                loader.loadSimulation(
                        "data/simulation.json"
                );

        CompensationEngine engine =
                new CompensationEngine();

        HeatmapGenerator heatmap =
                new HeatmapGenerator();

        for(BodyRegion region : regions) {

            double stress =
                    region.getStress();

            String heatLevel =
                    heatmap.getHeatLevel(stress);

            String risk =
                    engine.evaluateRegionRisk(stress);

            System.out.println(
                    "REGION: "
                            + region.getName()
            );

            System.out.println(
                    "LOAD: "
                            + region.getLoad()
            );

            System.out.println(
                    "COMPENSATION: "
                            + region.getCompensation()
            );

            System.out.println(
                    "STRESS: "
                            + stress
            );

            System.out.println(
                    "HEATMAP: "
                            + heatLevel
            );

            System.out.println(
                    "RISK: "
                            + risk
            );

            System.out.println(
                    "----------------------"
            );
        }
    }
}