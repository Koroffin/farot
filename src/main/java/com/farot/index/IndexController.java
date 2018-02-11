package com.farot;

import java.net.URL;
import java.io.IOException;
import java.util.Scanner;
import java.io.InputStream;

public class IndexController {
	public IndexController () {

	}

    private static URL getResource(String resourceName) {
        URL url = Thread.currentThread().getContextClassLoader().getResource(resourceName);

        if (url == null) {
            ClassLoader cl = App.class.getClass().getClassLoader();

            if (cl != null) {
                url = cl.getResource(resourceName);
            }
        }

        if ((url == null) && (resourceName != null) && ((resourceName.length() == 0) || (resourceName.charAt(0) != '/'))) { 
            return getResource('/' + resourceName);
        }

        return url;
    }
    private static InputStream getResourceAsStream(String resourceName) {
        URL url = getResource(resourceName);

        try {
            return (url != null) ? url.openStream() : null;
        } catch (IOException e) {
            return null;
        }
    }

    private static String renderIndex() {
        StringBuilder result = new StringBuilder("");

        //Get file from resources folder
        InputStream is = getResourceAsStream("public/index.html");

        try (Scanner scanner = new Scanner(is)) {
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                result.append(line).append("\n");
            }

            scanner.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result.toString();
    }

    private static String index = renderIndex();

    public static String render() {
    	return index;
    }

}