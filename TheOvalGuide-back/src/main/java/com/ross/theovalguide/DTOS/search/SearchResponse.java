package com.ross.theovalguide.DTOS.search;

import java.util.List;

public record SearchResponse(List<SearchItem> items) {
}