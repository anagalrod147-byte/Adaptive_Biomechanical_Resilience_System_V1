package simulation;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import model.BodyRegion;

import java.io.FileReader;
import java.lang.reflect.Type;
import java.util.ArrayList;

public class SimulationLoader {

    public ArrayList<BodyRegion> loadSimulation(
            String path
    ) {

        try {

            Gson gson = new Gson();

            Type regionList =
                    new TypeToken<
                            ArrayList<BodyRegion>
                            >() {}.getType();

            return gson.fromJson(
                    new FileReader(path),
                    regionList
            );

        } catch (Exception e) {

            e.printStackTrace();

            return new ArrayList<>();
        }
    }
}
